import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MemberService } from 'src/app/_services/member.service';
import { Member } from 'src/app/model/members';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {

  @Input() member : Member | undefined

  constructor(private memberService : MemberService, private toastrService : ToastrService){}


  ngOnInit(): void {
    
  }

  addLike(member : Member){
    this.memberService.addLike(member.userName).subscribe({
      next : () => this.toastrService.success("You have liked " + member.userName),
      error: err =>{
        console.log('error ' + JSON.stringify(err));
        this.toastrService.error(err.error);
        
        
      }     
    })
  }
}
