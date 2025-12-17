import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

interface jwtPayload {
  role: string;
  sub: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private stompClient: Client;
  private connected = false;
  private notifications = new BehaviorSubject<any[]>([]);
  notifications$ = this.notifications.asObservable();
  private subscriptionAttempted = false;

  constructor(private cookieService: CookieService) {
    this.stompClient = new Client({
      webSocketFactory: () => {
        return new SockJS('https://sjkqbbn5-8081.inc1.devtunnels.ms/ws');
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
    });

    this.stompClient.onConnect = (frame) => {
      this.connected = true;
      this.subscriptionAttempted = false;
    };

    this.stompClient.onStompError = (frame) => {
      this.connected = false;
    };
    this.stompClient.activate();
  }

  subscribeToEmployeeNotifications(employeeId: number) {
    if (this.subscriptionAttempted) {
      return;
    }

    if (!this.connected) {
      const maxAttempts = 20;
      let attempts = 0;

      const interval = setInterval(() => {
        attempts++;
        if (this.connected) {
          clearInterval(interval);
          this.subscribeToEmployeeNotifications(employeeId);
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
        }
      }, 500);
      return;
    }

    this.subscriptionAttempted = true;

    try {
      this.stompClient.subscribe(`/topic/employee/${employeeId}`, (msg) => {
        try {
          const body = JSON.parse(msg.body);
          const current = this.notifications.value;
          this.notifications.next([...current, body]);
        } catch (error) {}
      });
    } catch (error) {
      this.subscriptionAttempted = false;
    }
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.connected = false;
      this.subscriptionAttempted = false;
    }
  }

  getNotifications() {
    return this.notifications.value;
  }

  clearNotifications() {
    this.notifications.next([]);
  }
  subscribeToReceptionistNotifications(receptionistMail: string) {
    if (!this.connected) {
      const interval = setInterval(() => {
        if (this.connected) {
          clearInterval(interval);
          this.subscribeToReceptionistNotifications(receptionistMail);
        }
      }, 500);
      return;
    }
    const topic = `/topic/receptionist/${receptionistMail}`;

    this.stompClient.subscribe(topic, (msg) => {
      const body = JSON.parse(msg.body);
      const current = this.notifications.value;
      this.notifications.next([...current, body]);
    });
  }
}
