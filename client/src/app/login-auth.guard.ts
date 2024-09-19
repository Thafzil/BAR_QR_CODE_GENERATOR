import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root'
})
export class LoginAuthGuard implements CanActivate {
  constructor(private appSrv:AppService, private router:Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this.appSrv.isLoggedIn()) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
  }
  
}
