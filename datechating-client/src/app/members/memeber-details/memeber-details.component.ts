import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Member } from 'src/app/model/members';
import { MemberService } from 'src/app/_services/member.service';
import { TabDirective, TabsModule, TabsetComponent } from 'ngx-bootstrap/tabs';
import { CommonModule } from '@angular/common';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TimeagoModule } from 'ngx-timeago';
import { MemberMessageComponent } from '../member-message/member-message.component';
import { MessageService } from 'src/app/_services/message.service';
import { Message } from 'src/app/model/message';
import { PresenceSignalrService } from 'src/app/_services/presence.signalr.service';
import { AccountService } from 'src/app/_services/account.service';
import { User } from 'src/app/model/user';
import { take } from 'rxjs';
//import {GalleryItem, GalleryModule, ImageItem} from 'ng-gallery';

@Component({
  standalone : true,
  selector: 'app-memeber-details',
  templateUrl: './memeber-details.component.html',
  styleUrls: ['./memeber-details.component.css'],
  imports:[CommonModule, TabsModule, GalleryModule, TimeagoModule, MemberMessageComponent]
})
export class MemeberDetailsComponent implements OnInit, OnDestroy{
  @ViewChild('memberTabs', {static : true}) memberTabs? : TabsetComponent;
  activeTab? : TabDirective;
  member : Member = {} as Member;
  images : GalleryItem[]=[];
  messages: Message[]=[];
  user? : User;
  
  constructor(private memberService : MemberService, 
    private route : ActivatedRoute, 
    private messageService : MessageService, 
    public presenceService : PresenceSignalrService,
    private accountService : AccountService){

      this.accountService.currentUser$.pipe(take(1)).subscribe({
        next : user => {
          if(user) this.user = user;
        }
      })
    }

 
  
  
  ngOnInit(): void { 

    this.route.data.subscribe({
      next : data => this.member = data['member']
    })

    this.route.queryParams.subscribe({
      next : params => {
        params['tab'] && this.selectTab(params['tab'])
      }
    })

    this.getImages();
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  selectTab(heading : string){
    if(this.memberTabs){
      this.memberTabs.tabs.find(x => x.heading === heading)!.active = true;
    }
  }

  onTabActivated(data : TabDirective){
    this.activeTab = data;
    if(this.user && this.activeTab.heading === 'Messages'){
      //this.loadMessageThread();
      this.messageService.createHubConnection(this.user, this.member.userName)
    }else{
      this.messageService.stopHubConnection();
    }
  }

  loadMessageThread(){
    if(this.member){
      this.messageService.getMessageThread(this.member.userName).subscribe({
        next: response => {
          this.messages = response
          console.log('messages : '+ JSON.stringify(this.messages));
          
        }
      })
    }
    
  }

  // loadMember(){
  //   var username = this.route.snapshot.paramMap.get('username');
  //   console.log('username  : ' + username);
    
  //   if(!username) return;

  //   this.memberService.getMember(username).subscribe({
  //     next : member => {
  //       this.member = member,
  //       console.log(JSON.stringify(this.member));
  //       this.getImages();
  //     }

  //   })
  // }

  getImages(){
    if(!this.member) return;
    for(const image of this.member?.photos){
      
      this.images.push(new ImageItem({src: image.url, thumb: image.url}));
     
    }
  }




}
