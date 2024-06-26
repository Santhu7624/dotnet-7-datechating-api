import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from './model/user';
import { AccountService } from './_services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'datechating-client';
  users: any;

  constructor(private http: HttpClient, 
              private accountService: AccountService) { }


  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser() {

    const userString = localStorage.getItem('user');
    console.log('app component ' + userString);

    if (!userString) return;

    const user: User = JSON.parse(localStorage.getItem('user')!);
    this.accountService.setCurrentUser(user);

  }



}
