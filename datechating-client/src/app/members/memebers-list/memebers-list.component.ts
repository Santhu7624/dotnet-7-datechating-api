import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/model/members';
import { MemberService } from 'src/app/_services/member.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-memebers-list',
  templateUrl: './memebers-list.component.html',
  styleUrls: ['./memebers-list.component.css']
})
export class MemebersListComponent implements OnInit{
  //members : Member[]=[];
  members$: Observable<Member[]> | undefined;

  constructor(private memberService : MemberService){}
  
  ngOnInit(): void {
    

    this.members$ = this.memberService.getMembers();
  }

  // loadMembers(){
  //   this.memberService.getMembers().subscribe({
  //     next : members => {
  //       this.members = members
  //       console.log(JSON.stringify(this.members));
        
  //     }
  //   })
  // }

}
