import { Injectable } from '@angular/core';
import { Client, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';

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
        console.log('🔌 Creating SockJS connection...');
        return new SockJS('http://localhost:8081/ws');
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: (str) => {
        console.log('STOMP Debug:', str);
      },
    });

    this.stompClient.onConnect = (frame) => {
      console.log('✅ STOMP connected successfully', frame);
      this.connected = true;
      this.subscriptionAttempted = false; // Reset flag on reconnect
    };

    this.stompClient.onStompError = (frame) => {
      console.error('❌ STOMP error:', frame);
      this.connected = false;
    };

    this.stompClient.onWebSocketClose = (event) => {
      console.warn('⚠️ WebSocket closed:', event);
      this.connected = false;
    };

    this.stompClient.onWebSocketError = (event) => {
      console.error('❌ WebSocket error:', event);
      this.connected = false;
    };

    this.stompClient.activate();
  }

  /**
   * Call this ONCE after login (not every send!)
   */
  subscribeToEmployeeNotifications(employeeId: number) {
    if (this.subscriptionAttempted) {
      console.warn('⚠️ Already subscribed or attempting subscription');
      return;
    }

    if (!this.connected) {
      console.warn('⚠️ Waiting for WebSocket connection...');
      const maxAttempts = 20; // 10 seconds max wait
      let attempts = 0;

      const interval = setInterval(() => {
        attempts++;
        if (this.connected) {
          clearInterval(interval);
          this.subscribeToEmployeeNotifications(employeeId);
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          console.error('❌ Failed to connect to WebSocket after 10 seconds');
        }
      }, 500);
      return;
    }

    this.subscriptionAttempted = true;
    console.log(`📡 Subscribing to /topic/employee/${employeeId}`);

    try {
      this.stompClient.subscribe(`/topic/employee/${employeeId}`, (msg) => {
        try {
          const body = JSON.parse(msg.body);
          console.log('📨 New notification received:', body);
          const current = this.notifications.value;
          this.notifications.next([...current, body]);
        } catch (error) {
          console.error('❌ Error parsing notification:', error);
        }
      });
      console.log('✅ Successfully subscribed to employee notifications');
    } catch (error) {
      console.error('❌ Subscription failed:', error);
      this.subscriptionAttempted = false; // Allow retry
    }
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.connected = false;
      this.subscriptionAttempted = false;
      console.log('🔌 WebSocket disconnected');
    }
  }

  getNotifications() {
    return this.notifications.value;
  }

  clearNotifications() {
    this.notifications.next([]);
  }
  subscribeToReceptionistNotifications(receptionistMail: string) {
  console.log("Attempting to subscribe to receptionist notifications for", receptionistMail);
    if (!this.connected) {
    console.warn("WebSocket not connected yet, retrying...");
    const interval = setInterval(() => {
      if (this.connected) {
        clearInterval(interval);
        console.log("done connection");
        this.subscribeToReceptionistNotifications(receptionistMail);
      }
    }, 500);
    return;
  }
  const topic = `/topic/receptionist/${receptionistMail}`;
  
  console.log("Subscribing to topic:", topic);
   this.stompClient.subscribe(topic, (msg) => {
    console.log("Notification received:", msg.body);
    const body = JSON.parse(msg.body);
    const current = this.notifications.value;
    this.notifications.next([...current, body]);
  });
}
}
