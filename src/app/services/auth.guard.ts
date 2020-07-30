import { Injectable } from '@angular/core';
import { CanActivate, Router, CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { tap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor( private authService: AuthService, private router: Router ) {}

  canLoad(): Observable<boolean> {
    return this.authService.isAuth()
        .pipe(
          // Efecto secundario
          tap( estado => {
            // Usuario no Logueado
            if ( !estado ) {
              this.router.navigate(['/login']);
            }
          }),
          take(1)
        );
  }

  canActivate(): Observable<boolean> {
    return this.authService.isAuth()
        .pipe(
          // Efecto secundario
          tap( estado => {
            // Usuario no Logueado
            if ( !estado ) {
              this.router.navigate(['/login']);
            }
          })
        );
  }

}
