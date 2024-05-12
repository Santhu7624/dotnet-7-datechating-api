import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../model/members';
import { map, of } from 'rxjs';
import { ThumbnailsPosition } from 'ng-gallery';
import { Userspecparams} from '../model/userspecparams';
import { PaginationResult, Pagination } from '../model/pagination';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  baseUrl = environment.apiUrl;
  members : Member[] =[]; 
  paginationResults : PaginationResult<Member[]> = new PaginationResult<Member[]>;

  constructor(private http : HttpClient) { }

  getMembers(paginationParams : Userspecparams){
    
    let params = new HttpParams();
    if(paginationParams){
      params = params.append('PageIndex', paginationParams.pageIndex);
      params = params.append('PageSize', paginationParams.pageSize); 
      params = params.append('Gender', paginationParams.gender);
      params = params.append('AgeFrom', paginationParams.ageFrom);
      params = params.append('AgeTo', paginationParams.ageTo);
    }    
    console.log(params);
    
    return this.http.get<Member[]>(this.baseUrl + 'user', {observe:'response' ,params : params}).pipe(
      map(response =>
        {
          if(response.body){
            this.paginationResults.result = response.body;
          }
          const pagination = response.headers.get('Pagination');
          
          if(pagination){
            this.paginationResults.pagination = JSON.parse(pagination);
          }

          return this.paginationResults;
        }
      )
    );
    
    
    //if(this.members.length> 0) return of(this.members);
    // return this.http.get<pagination<Member[]>>(this.baseUrl + 'user', {params : params}).pipe(
    //   map(respMember =>{
    //     this.members = respMember.data;
    //     return respMember;
    //   })
    // );
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

  setMemberMainPhoto(photoId : number){
    return this.http.put(this.baseUrl + 'user/set-main-photo/'+photoId,{});
  }

  deleteMemberPhoto(photoId : number){
    return this.http.delete(this.baseUrl + 'user/delete-photo/'+photoId, {});
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
