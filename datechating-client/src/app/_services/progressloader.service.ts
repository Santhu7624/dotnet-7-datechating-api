import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class ProgressloaderService {
  progressbarCount = 0;
  constructor(private ngxSpinnerService : NgxSpinnerService) { }


  busy(){
    this.progressbarCount ++;
    return this.ngxSpinnerService.show(undefined, {
      type:'line-scale-party',
      color:'#333333',
      bdColor:'rgb(255,255,255,0)'
    })
  }


  idle(){
    this.progressbarCount --;
    if(this.progressbarCount <= 0){
      this.progressbarCount = 0;

      this.ngxSpinnerService.hide();
    }
  }
}
