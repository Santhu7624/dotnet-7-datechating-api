import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Member } from '../model/members';
import { map, of, take } from 'rxjs';
import { ThumbnailsPosition } from 'ng-gallery';
import { Userspecparams} from '../model/userspecparams';
import { PaginationResult, Pagination } from '../model/pagination';
import { User } from '../model/user';
import { AccountService } from './account.service';
import { getPaginationResult } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  baseUrl = environment.apiUrl;
  members : Member[] =[]; 
  paginationResults : PaginationResult<Member[]> = new PaginationResult<Member[]>;
  memberCache = new Map();
  user : User | undefined;
  userParams : Userspecparams | undefined;

  constructor(private http : HttpClient, private accountService : AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if(user){
          this.userParams = new Userspecparams(user);
          this.user = user;
        }
      }
    })
   }

  getMembers(paginationParams : Userspecparams){
    //=== Check cache for result
    const response = this.memberCache.get(Object.values(paginationParams).join('-'));
    if(response){
      //console.log('cache returns   ' + JSON.stringify(response));
      return of(response);
      
      
    }
      
    let params = new HttpParams();
    if(paginationParams){
      params = params.append('PageIndex', paginationParams.pageIndex);
      params = params.append('PageSize', paginationParams.pageSize); 
      params = params.append('Gender', paginationParams.gender);
      params = params.append('AgeFrom', paginationParams.ageFrom);
      params = params.append('AgeTo', paginationParams.ageTo);
      params = params.append('OrderBy', paginationParams.orderBy);
    }    
        
    return getPaginationResult<Member[]>(this.baseUrl + 'user', params, this.http).pipe(
      map(response =>
        {
          //console.log('cache returns  2 ' + JSON.stringify(response));
          //=== Set result to cache
          this.memberCache.set(Object.values(paginationParams).join('-'), response);
          return response;
          
        })
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
    // const member = this.members.find(x => x.userName === username);
    // if(member) return of(member);
    const member = [...this.memberCache.values()]
    .reduce((prevarr, currArr) => prevarr.concat(currArr.result), []).
    find((member : Member) => member.userName === username);
    if(member) return of(member);

    return this.http.get<Member>(this.baseUrl + 'user/'+username);
  }

  getPaginationParams(){    
    return this.userParams;
  }

  setPaginationParams(params : Userspecparams){   
    this.userParams = params;    
    
  }

  resetPaginationParams(){
    if(this.user){
      this.userParams = new Userspecparams(this.user);
      return this.userParams;
    }
    return;
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

  
  //================================= Likes =================================

  addLike(userName : string){
    return this.http.post(this.baseUrl + 'like/'+userName, {});
  }

  getLikes(predicate : string){
    return this.http.get<Member[]>(this.baseUrl+'like?predicate='+ predicate);
  }

  getLikesWithPagination(predicate : string, pageNumber : number, pageSize : number){
          
    let params = new HttpParams();
    params = params.append('PageIndex', pageNumber);
    params = params.append('PageSize', pageSize);      
    params = params.append('Predicate', predicate); 
       
        
    return getPaginationResult<Member[]>(this.baseUrl + 'like', params, this.http);
     
    
  }


 

}
