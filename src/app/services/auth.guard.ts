import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private authService: AuthService, private router: Router ) {}

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
