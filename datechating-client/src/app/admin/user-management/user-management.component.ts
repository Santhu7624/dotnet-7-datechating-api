import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { initialState } from 'ngx-bootstrap/timepicker/reducer/timepicker.reducer';
import { AdminService } from 'src/app/_services/admin.service';
import { RolesModalComponent } from 'src/app/modals/roles-modal/roles-modal.component';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit{

  users : User[]=[];
  bsModalRef : BsModalRef<RolesModalComponent> = new BsModalRef<RolesModalComponent>();
  availableRoles = [
    'Admin', 'Moderator', 'Member'
  ]
  /**
   *
   */
  constructor(private adminService : AdminService, private modalService : BsModalService) {
    
    
  }

  ngOnInit(): void {
      this.getUserWithRoles();
  }

  getUserWithRoles(){
    this.adminService.getUserWithRoles().subscribe({
      next :  user => this.users = user
    })
  }

  openRolesModel(user: User){
    console.log('db existing roles : ' + JSON.stringify(user.roles));
    
    const config = {
      class: 'modal-dialog-centered',
      initialState:{
        username: user.username,
        availableRoles: this.availableRoles,
        selectedRoles: [...user.roles]
      }
    }

    this.bsModalRef = this.modalService.show(RolesModalComponent, config);
    this.bsModalRef.onHide?.subscribe({
      next : () =>{
        const selectedRoles = this.bsModalRef.content?.selectedRoles;
        console.log('user comp roles : ' + JSON.stringify(selectedRoles));
        
        if(!this.arrayEqual(selectedRoles!, user.roles)){
          console.log('user comp roles 2: ' + selectedRoles);
          this.adminService.updateUserRoles(user.username, selectedRoles!).subscribe({
            next : roles => user.roles = roles
          })
        }
      }
    })
  }

  private arrayEqual (arr1 : any[], arr2:any[])
  {
    return JSON.stringify(arr1.sort()) === JSON.stringify(arr2.sort());
  }

}
