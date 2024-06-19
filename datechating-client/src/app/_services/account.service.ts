import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../model/user';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PresenceSignalrService } from './presence.signalr.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;// "http://localhost:5123/api/";
  currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();



  constructor(private http: HttpClient, private presenceService : PresenceSignalrService) { }

  login(model: any) {
    return this.http.post<User>(this.baseUrl + "account/login", model).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          console.log('accountservice-> login ' + JSON.stringify(user));
          
          this.setCurrentUser(user);
        }
      })
    );

  }

  register(model: any) {
    return this.http.post<User>(this.baseUrl + "account/register", model).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user);
        }
      })
    )
  }

  setCurrentUser(user: User) {
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);

    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
    this.presenceService.createHubConnection(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.presenceService.stopHubConnection();
  }

  getDecodedToken(token : string){
    return JSON.parse(atob(token.split('.')[1]));
  }
}
