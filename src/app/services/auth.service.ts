import { Injectable } from '@angular/core';

import 'firebase/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';
import * as itemActions from '../ingreso-egreso/ingreso-egreso.actions';

import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription: Subscription;
  private _userRead: Usuario;

  get user() {
    // Para asegurarse de que _userRead no mute o cambie su valor
    // return { ...this._userRead };
    return this._userRead;
  }

  constructor(  public auth: AngularFireAuth,
                private firestore: AngularFirestore,
                private store: Store<AppState> ) { }

  initAuthListener() {

    this.auth.authState.subscribe( fUser => {

      if ( fUser ) {
        // Existe
        this.userSubscription = this.firestore.doc(`${fUser.uid}/usuario`).valueChanges()
              .subscribe( (firestoreUser: any) => {

                const user = Usuario.fromFirebase( firestoreUser );
                this._userRead = user;
                this.store.dispatch( authActions.setUser({ user }) );

              });
      } else {
        // No existe
        this._userRead = null;
        this.userSubscription?.unsubscribe();
        this.store.dispatch( authActions.unSetUser() );
        this.store.dispatch( itemActions.unSetItems() );
      }

    });
  }

  crearUsuario( nombre: string, email: string, password: string ) {

  // console.log({nombre, email, password});
  return this.auth.createUserWithEmailAndPassword( email, password )
          .then( ({ user}) => {

            const newUser = new Usuario( user.uid, nombre, user.email );

            // Llamar a la conexión de DB con Firestore
            return this.firestore.doc(`${ user.uid }/usuario`).set({ ...newUser });

          });

  }

  loginUsuario( email: string, password: string ) {

  // console.log({nombre, email, password});
  return this.auth.signInWithEmailAndPassword( email, password );
  }

  logout() {
    return this.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe(
      map( fUser => fUser != null )
    );
  }
}
