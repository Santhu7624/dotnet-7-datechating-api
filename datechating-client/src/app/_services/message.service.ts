import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getPaginationResult } from './paginationHelper';
import { environment } from 'src/environments/environment';
import { Message } from '../model/message';
import { HttpTransportType, HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { User } from '../model/user';
import { BehaviorSubject, take } from 'rxjs';
import { Group } from '../model/group';


@Injectable({
  providedIn: 'root'
})
export class MessageService {

  baseUrl = environment.apiUrl;
  hubUrl = environment.hubUrl;
  private hubConn? : HubConnection;

  private messageThreadSource = new BehaviorSubject<Message[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();

  constructor(private http : HttpClient) { }

  getMessages (pageNumber : number, pageSize: number, container : string)
  {
    let params = new HttpParams();
    params = params.append('PageIndex', pageNumber );
    params = params.append('PageSize', pageSize);
    params = params.append('Container', container);

    return getPaginationResult<Message[]>(this.baseUrl+'message', params, this.http);
  }

  createHubConnection(user : User, otherUserName : string){
    this.hubConn = new HubConnectionBuilder().withUrl(this.hubUrl + 'message?user='+otherUserName, {
      accessTokenFactory : () => user.token,
      skipNegotiation: true,
      transport: HttpTransportType.WebSockets
    }).withAutomaticReconnect().build();


    this.hubConn.start().catch(error => console.log(error));

    this.hubConn.on("ReceiveMessageThread", messages => {
      this.messageThreadSource.next(messages);
    });

    this.hubConn.on("NewMessage", message => {
      this.messageThread$.pipe(take(1)).subscribe({
        next : messages => {
          this.messageThreadSource.next([...messages, message])
        }
      })
    });

    this.hubConn.on('UpdatedGroup', (group : Group) =>{
      if(group.connection.some(x => x.username === otherUserName)){
        this.messageThread$.pipe(take(1)).subscribe({
          next : messages => {
            messages.forEach(message =>{
              if(!message.dateRead){
                message.dateRead = new Date(Date.now());
              }
            })
            this.messageThreadSource.next([...messages]);
          }
        })
      }
    });

  }

  stopHubConnection(){
    if(this.hubConn)
      this.hubConn?.stop().catch(error => console.log(error));
  }

  getMessageThread(Username : string){
    console.log('username : '+ Username );
    
    return this.http.get<Message[]>(this.baseUrl + 'message/thread/' + Username);
  }

  async sendMessage(username : string, content : string){
    // return this.http.post<Message>(this.baseUrl + 'message' , {recipientUsername: username, content})

    return this.hubConn?.invoke('SendMessage', {recipientUsername: username, content}).catch(error => console.log(error));
    
  }

  deleteMessage(id : number){
    return this.http.delete(this.baseUrl + 'message/' +id);
  }
}
