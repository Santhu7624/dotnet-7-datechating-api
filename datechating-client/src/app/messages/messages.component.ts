import { Component, OnInit } from '@angular/core';
import { Message } from '../model/message';
import { Pagination } from '../model/pagination';
import { MessageService } from '../_services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  messages? : Message[];
  pagination? : Pagination
  container = 'Unread';
  pageNumber = 1;
  pageSize = 4;
  loading = false;

  constructor(private messageService : MessageService){}


  ngOnInit(): void {
      this.loadMessages();
  }

  loadMessages()
  {
    this.loading = true;
    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container).subscribe({
      next:  response => {
        if(response)
          this.messages = response.result,
          this.pagination = response.pagination,
          this.loading = false;
      }

    })
  }

  deleteMessage(id : number){
    this.messageService.deleteMessage(id).subscribe({
      next: () => {
        this.messages?.splice(this.messages.findIndex(m => m.id === id),1);
      }
    })
  }

  onPageCheand(event: any){
    if(this.pageNumber !== event){
      this.pageNumber = event;
      this.loadMessages();
    }
  }

}
