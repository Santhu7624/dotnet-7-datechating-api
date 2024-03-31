import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  
  registerMode = false;
  users: any;
  

  constructor(private http : HttpClient){}
  
  ngOnInit(): void {
    //throw new Error('Method not implemented.');
    this.getUsers();
  }

  getUsers(){
    this.http.get<any>('http://localhost:5123/api/user').subscribe({
      next: response => {
        console.log(response);
        this.users = response
      },
      error: err => console.log(err),
      complete: () => console.log("completed")   
      
    });
  }
    
  registerToggle() {
    this.registerMode = !this.registerMode;
  }

  cancelChildReg(event : boolean){
    this.registerMode = event;
  }

}
