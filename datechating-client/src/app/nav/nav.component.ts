import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  isloogedIn = false;
  model: any = {};

  constructor(
    public accountService: AccountService,
    private toastr: ToastrService,
    private router: Router) { }


  ngOnInit(): void {
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.accountService.currentUser$.subscribe({
      next: user => this.isloogedIn = !!user,
      error: error => console.log(error)

    })
  }

  login() {
    console.log("Calling Login : " + JSON.stringify(this.model));

    this.accountService.login(this.model).subscribe({
      next: resp => {
        //console.log("Success Login : " +JSON.stringify(resp)),
        //this.isloogedIn = true
        this.router.navigateByUrl("/members");
      },
      error: error => this.toastr.error(error.error),
      complete: () => console.log("Complete")

    });
  }



  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
