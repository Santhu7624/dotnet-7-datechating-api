import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NavigationExtras, Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private route : Router, private toastr : ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) =>{
        if(error)
        {
          switch(error.status)
          {
            case 400:
              if(error.error.errors)
              {
                const httpStatusError = [];
                for(let key of error.error.errors)
                {
                  if(error.error.errors[key])
                  {
                    httpStatusError.push(error.error.errors[key]);
                  }
                }
                throw httpStatusError.flat();
              }else{
                this.toastr.error("Bad request");
              }
              break;
            case 401:
              this.toastr.error('UnAuthorised', error.status.toString());
              break;
            case 404:
              this.toastr.error('No Page');
              this.route.navigateByUrl('/not-found');
              break;

            case 500:
              const navigationExtras: NavigationExtras={state : {error: error.error}};
              this.route.navigateByUrl('/server-error', navigationExtras)
              break;
            default:
              this.toastr.error("Unkonow Error occured");
              console.log(error);            
          }
        }
        else{
          this.toastr.error("Unkonow Error occured");
        }
        throw error;
      })
    )
  }
}
