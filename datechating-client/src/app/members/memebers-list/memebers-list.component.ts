import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Member } from 'src/app/model/members';
import { MemberService } from 'src/app/_services/member.service';
import { Observable, of, take } from 'rxjs';
import { Userspecparams } from 'src/app/model/userspecparams';
import { User } from 'src/app/model/user';
import { AccountService } from 'src/app/_services/account.service';

@Component({
  selector: 'app-memebers-list',
  templateUrl: './memebers-list.component.html',
  styleUrls: ['./memebers-list.component.css']
})
export class MemebersListComponent implements OnInit{
  members : Member[]=[];
  //members$: Observable<Member[]> | undefined;
  totalCount = 0;
  pageSize = 0; 
  selectedItemsPerPage : number | undefined;
  paginationParams : Userspecparams | undefined;
  //user : User | undefined;

  genderList = [  
    {value:'male', display:'Male'},
    {value:'female', display:'Female'},

  ]
  //@ViewChild('selectedItemsPerPage') selectedItemsPerPage !: ElementRef;

  constructor(private memberService : MemberService){
    this.paginationParams = this.memberService.getPaginationParams();
    //console.log('member-list construct : '+ JSON.stringify(this.paginationParams));
    
    // this.accountService.currentUser$.pipe(take(1)).subscribe({
    //   next: user => {
    //     if(user){
    //       this.paginationParams = new Userspecparams(user);
    //       this.user = user;
    //     }
    //   }
    // })
  }
  
  ngOnInit(): void {    
    this.getMembers();    
  }

  getMembers(){    
    
    if(this.paginationParams) {
      
      this.selectedItemsPerPage = this.paginationParams?.pageSize;
      this.memberService.setPaginationParams(this.paginationParams);
      this.memberService.getMembers(this.paginationParams).subscribe({
        next : response => {                 
          this.members = response.result;   
              
          //this.members$ = of(members);
          //console.log('member-list getMembers 5 : '+ JSON.stringify(this.members$ ));
          if(response.pagination){
            this.totalCount = response.pagination?.totalItems; 
            this.pageSize = response.pagination?.itemsPerPage;
          }          
        },
        error: error =>{
          console.log(error);
          
        }
      }
    ); 
  }    
} 

  onPageCheand(event : any){
    if(this.paginationParams && this.paginationParams?.pageIndex !== event){
      this.paginationParams.pageIndex = event;
      this.memberService.setPaginationParams(this.paginationParams);   
      
      this.getMembers();
    
    }  
  }
  onItemsPerPageCheand(){
    
    // if(this.selectedItemsPerPage.nativeElement.value)
    // {
    //   this.paginationParams.pageSize = this.selectedItemsPerPage.nativeElement.value;
    
    if(this.paginationParams && this.selectedItemsPerPage && this.paginationParams?.pageSize !== this.selectedItemsPerPage){
      this.paginationParams.pageSize = this.selectedItemsPerPage;
      this.memberService.setPaginationParams(this.paginationParams);
      
      this.getMembers();
    
    }
  }

  applyFilters(){
    
    if(this.paginationParams){
      
      this.getMembers();
    }
      
  }

  resetFilters(){   
      this.paginationParams = this.memberService.resetPaginationParams();
      this.getMembers();       
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



