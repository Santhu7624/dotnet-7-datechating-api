import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.component.html',
  styleUrls: ['./server-error.component.css']
})
export class ServerErrorComponent {

  error: any;

  constructor(private route: Router){
    const navigator = this.route.getCurrentNavigation();
    this.error = navigator?.extras?.state?.['error'];
  }
}
