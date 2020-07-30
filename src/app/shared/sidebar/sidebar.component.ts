import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {

  nombre: string = '';
  userSubs: Subscription;

  constructor(  private authService: AuthService,
                private router: Router,
                private store: Store<AppState>) { }

  ngOnInit(): void {

    this.userSubs = this.store.select('user')
                      .pipe(
                        filter( ({user}) => user != null )
                      )
                      .subscribe( ({ user }) => this.nombre = user.nombre );

  }

  ngOnDestroy(): void {

    this.userSubs.unsubscribe();

  }

  logout() {

    Swal.fire({
      title: 'Cerrando Sesión',
      onBeforeOpen: () => {
        Swal.showLoading();
      }
    });

    this.authService.logout()
          .then( () => {
            Swal.close();
            this.router.navigate(['/login']);
          });
  }

}
