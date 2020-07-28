import { Injectable } from '@angular/core';

import 'firebase/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';

import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription: Subscription;

  constructor(  public auth: AngularFireAuth,
                private firestore: AngularFirestore,
                private store: Store<AppState> ) { }

  initAuthListener() {

    this.auth.authState.subscribe( fUser => {

      if ( fUser ) {
        // Existe
        this.userSubscription = this.firestore.doc(`${fUser.uid}/usuario`).valueChanges()
              .subscribe( (firestoreUser: any) => {
                console.log(firestoreUser);
                const user = Usuario.fromFirebase( firestoreUser );
                this.store.dispatch( authActions.setUser({ user }) );
              });
      } else {
        // No existe
        // this.userSubscription.unsubscribe();
        this.userSubscription.unsubscribe();
        this.store.dispatch( authActions.unSetUser() );
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
