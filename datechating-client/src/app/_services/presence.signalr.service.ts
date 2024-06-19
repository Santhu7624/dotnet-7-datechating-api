import { Injectable } from '@angular/core';
import { HttpTransportType, HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { User } from '../model/user';
import { BehaviorSubject, take } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PresenceSignalrService {

  hubUrl = environment.hubUrl;
  private hubConn? : HubConnection;
  onlineUserSource = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUserSource.asObservable();

  constructor(private toastr : ToastrService, private router :Router) { }

  createHubConnection(user : User){
    this.hubConn = new HubConnectionBuilder()
        .withUrl(this.hubUrl + 'presence', {
          accessTokenFactory: () => user.token,
          skipNegotiation: true,
          transport: HttpTransportType.WebSockets
        })
        .withAutomaticReconnect()
        .build();
    
    this.hubConn.start().catch(error => console.log(error));

    this.hubConn.on('UserIsOnline', username => {
      //this.toastr.info(username + ' has connected');

      this.onlineUsers$.pipe(take(1)).subscribe({
        next : usernames => this.onlineUserSource.next([...usernames, username])
      })
      
    })

    this.hubConn.on('UserIsOffline', username => 
    {
      //this.toastr.info(username + ' has disconnected')
      this.onlineUsers$.pipe(take(1)).subscribe({
        next: usernames => this.onlineUserSource.next(usernames.filter(x => x !== username))
      })
    })  
    
    this.hubConn.on('GetOnlineUsers', currentUsers => {
      this.onlineUserSource.next(currentUsers);
    })

    this.hubConn.on('NewMessageReceived', ({username, knownAs}) => {
      this.toastr.info(username + ' has sent you a new message! Click me to see it')
        .onTap
        .pipe(take(1)).subscribe({
          next : () => this.router.navigateByUrl('/members/'+ username + '?tab=Messages')
        })
    })
    
  }

  stopHubConnection(){
    this.hubConn?.stop().catch(error => console.log(error))
  }
}
