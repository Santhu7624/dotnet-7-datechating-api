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
  //members : Member[]=[];
  members$: Observable<Member[]> | undefined;
  totalCount = 0;
  pageSize = 0; 
  selectedItemsPerPage : number | undefined;
  paginationParams : Userspecparams | undefined;
  user : User | undefined;
  //@ViewChild('selectedItemsPerPage') selectedItemsPerPage !: ElementRef;

  constructor(private memberService : MemberService, private accountService : AccountService){
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if(user){
          this.paginationParams = new Userspecparams(user);
          this.user = user;
        }
      }
    })
  }
  
  ngOnInit(): void {    
    this.getMembers();    
  }

  getMembers(){
    console.log('getmembers');
    
    console.log(JSON.stringify(this.paginationParams));

    if(!this.paginationParams) return;

    this.selectedItemsPerPage = this.paginationParams?.pageSize;
    this.memberService.getMembers(this.paginationParams).subscribe({
      next : response => {       
       
        const members = response.result as Member[];      
        this.members$ = of(members);
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

  onPageCheand(event : any){
    if(this.paginationParams && this.paginationParams?.pageIndex !== event){
      this.paginationParams.pageIndex = event;
      console.log('on change page Index : '+ event);
      
      this.getMembers();
    
    }  
  }
  onItemsPerPageCheand(){
    
    // if(this.selectedItemsPerPage.nativeElement.value)
    // {
    //   this.paginationParams.pageSize = this.selectedItemsPerPage.nativeElement.value;
    
    if(this.paginationParams && this.selectedItemsPerPage && this.paginationParams?.pageSize !== this.selectedItemsPerPage){
    this.paginationParams.pageSize = this.selectedItemsPerPage;
      console.log('on change page soze : '+ this.paginationParams.pageSize);
      
      this.getMembers();
    
    }
  }

  applyFilters(){
    if(this.paginationParams)
      this.getMembers();
  }

  resetFilters(){
    if(this.user){
      this.paginationParams = new Userspecparams(this.user);
      this.getMembers();
    }
    
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



