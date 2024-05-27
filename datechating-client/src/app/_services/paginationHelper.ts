import { HttpClient, HttpParams } from "@angular/common/http";
import { PaginationResult } from "../model/pagination";
import { map } from "rxjs";



export function getPaginationResult<T>(url: string, params : HttpParams, http : HttpClient){
    const paginationResults : PaginationResult<T> = new PaginationResult<T>;

    return http.get<T>(url, {observe: 'response', params : params}).pipe(
     map(response => {
      if(response.body){
        paginationResults.result = response.body;
      }
      const pagination = response.headers.get('Pagination');
      
      if(pagination){
        paginationResults.pagination = JSON.parse(pagination);
      }

      return paginationResults;
     }) 
    );
  }