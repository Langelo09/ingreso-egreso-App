import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
  ]
})
export class NavbarComponent implements OnInit, OnDestroy {

  nombre: string = '';
  userSubs: Subscription;

  constructor( private store: Store<AppState>) { }

  ngOnInit(): void {

    this.store.select('user')
      .pipe(
        filter( ({user}) => user != null )
      )
      .subscribe( ({ user }) => this.nombre = user.nombre );
  }

  ngOnDestroy(): void {

    this.userSubs.unsubscribe();
    
  }

}
