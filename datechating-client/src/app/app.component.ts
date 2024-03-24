import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'datechating-client';
  users: any;

  constructor(private http : HttpClient){ }
  
  
  ngOnInit(): void {
    this.http.get<any>('http://localhost:5123/api/user').subscribe({
      next: response => {
        console.log(response);
        this.users = response
      },
      error: err => console.log(err),
      complete: () => console.log("completed")   
      
    });

    
  }

  

}
