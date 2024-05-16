import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Member } from 'src/app/model/members';
import { MemberService } from 'src/app/_services/member.service';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CommonModule } from '@angular/common';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TimeagoModule } from 'ngx-timeago';
//import {GalleryItem, GalleryModule, ImageItem} from 'ng-gallery';

@Component({
  standalone : true,
  selector: 'app-memeber-details',
  templateUrl: './memeber-details.component.html',
  styleUrls: ['./memeber-details.component.css'],
  imports:[CommonModule, TabsModule, GalleryModule, TimeagoModule]
})
export class MemeberDetailsComponent implements OnInit{

  member : Member | undefined;
  images : GalleryItem[]=[];
  
  constructor(private memberService : MemberService, private route : ActivatedRoute){}
  
  
  ngOnInit(): void {
    this.loadMember();
  }

  loadMember(){
    var username = this.route.snapshot.paramMap.get('username');
    console.log('username  : ' + username);
    
    if(!username) return;

    this.memberService.getMember(username).subscribe({
      next : member => {
        this.member = member,
        console.log(JSON.stringify(this.member));
        this.getImages();
      }

    })
  }

  getImages(){
    if(!this.member) return;
    for(const image of this.member?.photos){
      
      this.images.push(new ImageItem({src: image.url, thumb: image.url}));
     
    }
  }




}
