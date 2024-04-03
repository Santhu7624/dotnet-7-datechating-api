import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from '../services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  model: any = {};
  // @Input() userInputFromParent : any;
  @Output() cancelRegEvent = new EventEmitter<boolean>();

  constructor(private accountService: AccountService, private toastr: ToastrService) { }

  ngOnInit(): void {

  }


  register() {
    //console.log(JSON.stringify(""))
    this.accountService.register(this.model).subscribe({
      next: () => {
        this.cancelReg();
      },
      error: err => this.toastr.error(err.error)

    });
  }

  cancelReg() {
    this.cancelRegEvent.emit(false);
  }
}
