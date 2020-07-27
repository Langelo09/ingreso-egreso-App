import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor( private formB: FormBuilder, private authService: AuthService, private router: Router ) { }

  ngOnInit(): void {

    this.loginForm = this.formB.group({

      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]

    });

  }

  loginUsuario() {

    if ( this.loginForm.invalid ) {
      return;
    }

    Swal.fire({
      title: 'Espere por favor',
      onBeforeOpen: () => {
        Swal.showLoading();
      }
    });

    const { correo, password } = this.loginForm.value;

    this.authService.loginUsuario( correo, password )
    .then( credenciales => {
      console.log(credenciales);
      Swal.close();
      this.router.navigate(['/']);
    })
    .catch( err => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message
      });
    } );
  }

}
