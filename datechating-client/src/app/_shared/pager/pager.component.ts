import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.css']
})
export class PagerComponent implements OnInit {
  
  @Input() totalCount? : number;
  @Input() pageSize? : number;

  @Output() childOnPageChange = new EventEmitter<number>();
  
  ngOnInit(): void {
    console.log('pager on init : pagesize :'+ this.pageSize + ' totalcount : ' + this.totalCount);
    
  }

  onPageChanged(event : any){
    this.childOnPageChange.emit(event.page);
  }
  
}
