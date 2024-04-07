
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FileService } from 'src/app/services/file.service';
import {HttpErrorResponse, HttpEventType, HttpResponse} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit{
  progress : number=0;
  message  : string="";
  @Output() public onUploadFinished = new EventEmitter();
  photos : string[] =[];
  isDownload: boolean =false;
  isUpload: boolean=false;

  constructor(private fileService: FileService, private toatsr : ToastrService){}

  ngOnInit(): void{
    this.getEmojis();
  }

  uploadFiles = (files: any) =>{
    this.isDownload = false;
    this.isUpload = true;
    this.fileService.UploadFile(files).subscribe({
      next : (event) => {
        if(event.type === HttpEventType.UploadProgress)
          this.progress = event.total ? Math.round(100 * event.loaded / event.total) : 0;
        else if(event.type === HttpEventType.Response){
          this.toatsr.success('Upload success.');
          this.message = 'Upload success.';
          this.onUploadFinished.emit(event.body);
          this.getEmojis();
        }
      },
      error : (err : HttpErrorResponse) => console.log(err)
      
    })
  }

  downloadFile(fileUrl: string){
    this.isDownload = true;
    this.isUpload = false;
    
    console.log('downloadFile ' + fileUrl);
    this.fileService.downloadFile(fileUrl).subscribe((event) => {
            
      if(event.type === HttpEventType.UploadProgress){
        this.progress = event.total?  Math.round((event.loaded * 100)/event.total ) : 0;
        console.log('progress : '+ this.progress + '%');
        
      }else if(event.type === HttpEventType.Response){
        this.message = 'Download success.';
        this.downloadEvent(event, fileUrl);
      }
      
    })
  }

  private downloadEvent = (data : HttpResponse<Blob>, fileUrl : string) =>{
    const downlodFile = new Blob([data.body!], {type: data.body?.type});
    const a = document.createElement('a');
    a.setAttribute('style', 'display:none');
    document.body.appendChild(a);
    a.download = fileUrl;
    a.href = URL.createObjectURL(downlodFile);
    a.target = '_blank';
    a.click();
    document.body.removeChild(a);
  }

  getEmojis(){
    this.fileService.getEmojis().subscribe({
      next: (response : any) => {
        console.log(response['emojis']);
        
        this.photos =response['emojis']
      }
    })
  }

  public createImgPath = (serverPath: string) => { 
    return `http://localhost:5123/${serverPath}`; 
  }

}
