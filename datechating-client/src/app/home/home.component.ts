import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  
  registerMode = false;
  users: any;
  

  constructor(private http : HttpClient, private route : Router){}
  
  ngOnInit(): void {
    //throw new Error('Method not implemented.');
    this.getUsers();
  }

  getUsers(){
    const user = localStorage.getItem('user');
    if(user){
      this.route.navigateByUrl('/members');
    }
    // this.http.get<any>('http://localhost:5123/api/user').subscribe({
    //   next: response => {
    //     console.log(response);
    //     this.users = response
    //   },
    //   error: err => console.log(err),
    //   complete: () => console.log("completed")   
      
    // });
  }
    
  registerToggle() {
    this.registerMode = !this.registerMode;
  }

  cancelChildReg(event : boolean){
    this.registerMode = event;
  }

}
