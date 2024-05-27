import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getPaginationResult } from './paginationHelper';
import { environment } from 'src/environments/environment';
import { Message } from '../model/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  baseUrl = environment.apiUrl;

  constructor(private http : HttpClient) { }

  getMessages (pageNumber : number, pageSize: number, container : string)
  {
    let params = new HttpParams();
    params = params.append('PageIndex', pageNumber );
    params = params.append('PageSize', pageSize);
    params = params.append('Container', container);

    return getPaginationResult<Message[]>(this.baseUrl+'message', params, this.http);
  }

  getMessageThread(Username : string){
    console.log('username : '+ Username );
    
    return this.http.get<Message[]>(this.baseUrl + 'message/thread/' + Username);
  }

  sendMessage(username : string, content : string){
    return this.http.post<Message>(this.baseUrl + 'message' , {recipientUsername: username, content})
  }

  deleteMessage(id : number){
    return this.http.delete(this.baseUrl + 'message/' +id);
  }
}
