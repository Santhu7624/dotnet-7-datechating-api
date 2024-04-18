import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Member } from 'src/app/model/members';
import { User } from 'src/app/model/user';
import { AccountService } from 'src/app/_services/account.service';
import { MemberService } from 'src/app/_services/member.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {

  member : Member | undefined;
  user: User | null =null;
  @ViewChild('editForm') editForm : NgForm | undefined;
  @HostListener('window:beforeunload',['$event']) unloadNotification($event : any){
    if(this.editForm?.dirty){
      $event.returnValue = true;
    }
    
  }

  constructor(private accountService : AccountService, private memberService : MemberService, private toastr : ToastrService){

    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => this.user = user
    })
  }
  ngOnInit(): void {
    //throw new Error('Method not implemented.');
    this.loadMember();
  }

  loadMember(){
    if(!this.user)  return;

    this.memberService.getMember(this.user.username).subscribe({
      next: member => this.member = member
    })
  }

  updateMember(){
    this.memberService.updateMember(this.editForm?.value).subscribe({
      next : _ => {
        this.toastr.success('Updated successfully');
        this.editForm?.reset(this.member);
      }
    })   
    
  }

}
