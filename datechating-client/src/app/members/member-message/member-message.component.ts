import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TimeagoModule } from 'ngx-timeago';
import { MessageService } from 'src/app/_services/message.service';
import { Member } from 'src/app/model/members';
import { Message } from 'src/app/model/message';

@Component({
  selector: 'app-member-message',
  standalone : true,
  templateUrl: './member-message.component.html',
  styleUrls: ['./member-message.component.css'],
  imports:[CommonModule, TimeagoModule, FormsModule]
})
export class MemberMessageComponent implements OnInit {

  @ViewChild('messageForm') messageForm? : NgForm;
  @Input() messages : Message[] = [];
  @Input() username? : string;
  messageContent = '';

  constructor(public messageService : MessageService){}

  ngOnInit(): void{
    
  }

  

  sendMessage(){
    if(!this.username) return;
    this.messageService.sendMessage(this.username,this.messageContent).then(() =>{
      this.messageForm?.reset();
    });

    //this.messageService.sendMessage(this.username,this.messageContent).subscribe({
      //next: message => {

        // this.messages.push(message);
        // this.messageForm?.reset();
      //}
    //})
  }

}
