import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  model: any = {};
  // @Input() userInputFromParent : any;
  registerForm : FormGroup = new FormGroup({});
  maxDate : Date = new Date();

  @Output() cancelRegEvent = new EventEmitter<boolean>();

  constructor(private accountService: AccountService, 
    private toastr: ToastrService,
    private fb : FormBuilder,
    private route : Router) 
    { 
      
    }

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear() -18);
  }

  initializeForm(){
    this.registerForm = this.fb.group({
      gender:'male',
      username : ['', Validators.required ],
      knownAs : [''],
      dateOfBirth:['', Validators.required],
      city : ['', Validators.required],
      country:['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4),Validators.maxLength(8)]],
      confirmPassword : ['', [Validators.required, this.matchValues('password')]]
    });

    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    })
  }

  matchValues(matchTo: string): ValidatorFn{
    return (control : AbstractControl) =>{
      return control.value === control.parent?.get(matchTo)?.value ? null : {notMatching : true}
    }
  }

  register() {
    
    const dob = this.getDateOnly(this.registerForm.controls['dateOfBirth'].value);
    console.log(dob);
    
    const values = {...this.registerForm.value, dateOfBirth: dob};
    console.log(JSON.stringify(values));
    this.accountService.register(values).subscribe({
      next: () => {
        this.route.navigateByUrl('/members');
      },
      error: err => this.toastr.error(err.error)

    });
  }

  cancelReg() {
    this.cancelRegEvent.emit(false);
  }

  getDateOnly(dob : string | undefined){
    if(!dob) return;

    let theDob = new Date(dob);
    return new Date(theDob.setMinutes(theDob.getMinutes() - theDob.getTimezoneOffset()))
      .toISOString().slice(0,10);
  }
}
