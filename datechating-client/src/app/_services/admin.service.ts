import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  baseUrl = environment.apiUrl;

  constructor(private http : HttpClient) { }

  getUserWithRoles(){
    return this.http.get<User[]>(this.baseUrl + 'admin/users-with-roles');
  }

  updateUserRoles(username : string, roles: string[]){
    console.log('user comp roles 3: ' + roles);
    return this.http.post<string[]>(this.baseUrl + 'admin/edit-roles/'+ username+ '?roles=' +roles,{});
  }
}