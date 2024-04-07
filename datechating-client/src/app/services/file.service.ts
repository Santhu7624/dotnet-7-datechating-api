import { Injectable } from '@angular/core';

import {HttpClient, HttpEventType, HttpErrorResponse} from '@angular/common/http';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  baseUrl = "http://localhost:5123/api";
  photos = new BehaviorSubject<string>('');
  photos$ = this.photos.asObservable();
  emojis : any;

  constructor(private http: HttpClient) { }

  UploadFile = (files : File[]) => {
    console.log('service.. file upload');
    
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    console.log('name  : ' , fileToUpload.name);
    formData.append('file', fileToUpload, fileToUpload.name);
    this.photos.next(this.emojis)
    return this.http.post(this.baseUrl+'/file/uploadfile', formData, {reportProgress:true, observe:'events'});
              
  }

  downloadFile(fileUrl : string){
    console.log('service=> downloadfile ' + fileUrl);
    
    return this.http.get(this.baseUrl + `/file/downloadfile?fileUrl=${fileUrl}`,
                        {reportProgress: true, responseType:'blob',observe:'events'});
  }

  getEmojis(){
    return this.http.get(this.baseUrl + '/file/getemojis');
  }

}
