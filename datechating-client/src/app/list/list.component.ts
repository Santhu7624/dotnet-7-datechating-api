import { Component, OnInit } from '@angular/core';
import { MemberService } from '../_services/member.service';
import { Member } from '../model/members';
import { ToastrService } from 'ngx-toastr';
import { Userspecparams } from '../model/userspecparams';
import { Pagination } from '../model/pagination';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  members: Member[] | undefined;
  predicate = "liked";
  pagination : Pagination | undefined;
 
  pageSize =4;
  pagenumber =1;
  
  constructor(private memberService: MemberService, private toastrService: ToastrService){}
  
  ngOnInit(): void {
    
    this.loadLikedUsers();
    
  }

  loadLikedUsers(){
    // this.memberService.getLikes(this.predicate).subscribe({
    //   next : response => this.members = response,
    //   error : err => this.toastrService.error(err.error)
    // })
    
      this.memberService.getLikesWithPagination(this.predicate, this.pagenumber, this.pageSize).subscribe({
        next : response =>{
          console.log(JSON.stringify(response));          
          this.members = response.result;
          console.log('pagination params : '+ JSON.stringify(response.pagination));
          
          this.pagination = response.pagination
        }
      });
    
    
  }
  onPageCheand(event : any){
    console.log('event page changed : '+event);
    
    if(this.pagenumber !== event){
      this.pagenumber = event;      
      this.loadLikedUsers();
    
    }  
  }

}
