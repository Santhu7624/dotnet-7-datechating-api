import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-roles-modal',
  templateUrl: './roles-modal.component.html',
  styleUrls: ['./roles-modal.component.css']
})
export class RolesModalComponent{
  username ='';
  availableRoles : any[] = [];
  selectedRoles : any[] = [];

  constructor(public bsModalRef : BsModalRef){
    
    
  }
  
  
  updateChecked(checkedvale :string){

    console.log('selected roles :' + this.selectedRoles);
    
    const index = this.selectedRoles.indexOf(checkedvale);
    console.log('selected roles 2:' + index);
    index !== -1 ? this.selectedRoles.splice(index,1) : this.selectedRoles.push(checkedvale);

    console.log('selected roles 3:' + this.selectedRoles);
  }

}
