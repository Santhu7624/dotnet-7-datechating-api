import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, delay, finalize } from 'rxjs';
import { ProgressloaderService } from '../_services/progressloader.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private progressLoadService : ProgressloaderService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    this.progressLoadService.busy();
    return next.handle(request).pipe(
      delay(1000),
      finalize(() => {
        this.progressLoadService.idle();
      })
    );
  }
}
