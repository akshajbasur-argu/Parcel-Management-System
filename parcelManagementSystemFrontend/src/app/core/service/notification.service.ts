import { Injectable } from '@angular/core';
import { Client, Stomp } from '@stomp/stompjs';
import   SockJS from 'sockjs-client';
import { BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class NotificationService {
   private stompClient: Client;
  private notifications= new BehaviorSubject<any[]>([]);
  private custName: string ='';
  notifications$ = this.notifications.asObservable();

  token = ''
  constructor(private cookieService: CookieService){
    console.log("jfierjfker");
    this.custName = this.getUsername()

     this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8081/ws'),
      reconnectDelay: 5000,
    });
    console.log("ejfioeuf");

  }
    getUsername() {
    this.token = this.cookieService.get('accessToken');
    const decoded = jwtDecode<jwtPayload>(this.token);
    return decoded.sub;
  }

  connect(role: 'receptionist' | 'employee',id:number) {
  console.log(`/topic/employee/${id}`);
    this.stompClient.onConnect = () => {
      console.log('connected');
      if(role==='receptionist'){
        this.sendNotificationToReceptionist()
      }
      else{
        this.sendNotificationToEmployee(id)
      }
    };

    this.stompClient.activate();
  }

  sendNotificationToReceptionist(){
    this.stompClient.
                subscribe(`/topic/receptionist/${this.custName}`,(msg)=>{
                    console.log(msg.body);
                    const body = JSON.parse(msg.body)
                    const current = this.notifications.value;
                    this.notifications.next([...current,body]);
                });
  }
  sendNotificationToEmployee(id:number){
    console.log("kfrhjerhfejkrfnkjdfhrueh");


     this.stompClient.
                subscribe(`/topic/employee/${id}`,(msg)=>{
                    console.log(msg.body);
                    const body = JSON.parse(msg.body)
                    const current = this.notifications.value;
                    this.notifications.next([...current,body]);
                });
  }

  // send(destination: string, message: any) {
  //   this.stompClient?.send(`/app/${destination}`, {}, JSON.stringify(message));
  // }

  // disconnect() {
  //   this.stompClient?.disconnect();
  // }
}
interface jwtPayload {
  role: string;
  sub: string;
}

