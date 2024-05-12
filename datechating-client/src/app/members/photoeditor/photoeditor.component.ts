import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { AccountService } from 'src/app/_services/account.service';
import { MemberService } from 'src/app/_services/member.service';
import { Member } from 'src/app/model/members';
import { Photo } from 'src/app/model/photo';
import { User } from 'src/app/model/user';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-photoeditor',
  templateUrl: './photoeditor.component.html',
  styleUrls: ['./photoeditor.component.css']
})
export class PhotoeditorComponent implements OnInit {

  @Input() member : Member | undefined;
  uploader:FileUploader | undefined;
  hasBaseDropZoneOver = false;
  hasAnotherDropZoneOver = false;
  user : User | undefined;
  baseurl = environment.apiUrl;

  constructor(private accountService : AccountService, private memberService : MemberService, private toastrService: ToastrService)
  {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next : user => {
        if(user){
          console.log('token ' + this.user);
          
          this.user = user;
        }
      }
    })
  }

  ngOnInit(): void {
      this.initializeUploader();
  }

  initializeUploader(){
    this.uploader = new FileUploader({
      url : this.baseurl+'user/add-photo',
      authToken : 'Bearer ' + this.user?.token,
      isHTML5:true,
      allowedFileType:['image'],
      autoUpload:false,
      maxFileSize: 10*1024*1024
    })

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false
    }

    this.uploader.onSuccessItem = (item, response,status, header) =>{
      if(response)
        {
          const photo = JSON.parse(response);
          this.member?.photos.push(photo);
          if(photo.isMain && this.user && this.member){
            this.user.photoUrl = photo.url;
            this.member.photoUrl = photo.url;
          }
        }
    }

  }

  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }


  setMainPhoto(photo : Photo)
  {
    console.log('photo id : '+ photo.id);
    
    this.memberService.setMemberMainPhoto(photo.id).subscribe({
      next : () => {
        this.toastrService.success("Set main photo Ok.");
        if (this.user && this.member) {
          this.user.photoUrl = photo.url;
          this.accountService.setCurrentUser(this.user);
          this.member.photoUrl = photo.url;
          this.member.photos.forEach(p => {
            if (p.isMain) p.isMain = false;
            if (p.id === photo.id) p.isMain = true;
          })
        }
        

      }
    })
  }

  deletePhoto(photo: Photo)
  {
    this.memberService.deleteMemberPhoto(photo.id).subscribe({
      next: ()=>{
        if(this.user && this.member){
          this.accountService.setCurrentUser(this.user);
          const index = this.member?.photos.indexOf(photo);
          this.member?.photos.splice(index,1);
        }
        this.toastrService.success("photo delete success.");

      }
    })
  }
}
