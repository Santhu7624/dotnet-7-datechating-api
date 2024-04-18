import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../model/members';
import { map, of } from 'rxjs';
import { ThumbnailsPosition } from 'ng-gallery';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  baseUrl = environment.apiUrl;
  members : Member[] =[]; 

  constructor(private http : HttpClient) { }

  getMembers(){
    if(this.members.length> 0) return of(this.members);
    return this.http.get<Member[]>(this.baseUrl + 'user').pipe(
      map(respMember =>{
        this.members = respMember;
        return respMember;
      })
    );
  }

  getMember(username : string){
    const member = this.members.find(x => x.userName === username);
    if(member) return of(member);
    return this.http.get<Member>(this.baseUrl + 'user/'+username);
  }

  updateMember(member : Member){
   return this.http.put(this.baseUrl + 'user', member).pipe(
    map(() => {
      const index = this.members.indexOf(member);
      this.members[index] = {...this.members[index], ...member};
    })
   );
  }

  getHttpOptions(){
    const userToken = localStorage.getItem('user');
    if(!userToken) return;

    const user = JSON.parse(userToken);
    return {
      headers : new HttpHeaders({
        Authorization : 'Bearer ' + user.token
      })
    }
  }
}
