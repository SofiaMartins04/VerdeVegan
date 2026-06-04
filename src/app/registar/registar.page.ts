import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonContent,
  IonIcon
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-registar',
  templateUrl: './registar.page.html',
  styleUrls: ['./registar.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonIcon
  ]
})
export class RegistarPage {

  nome = '';
  email = '';
  contacto = '';
  morada = '';
  password = '';

  mostrarPassword = false;

  constructor(private router: Router) {}

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  registar() {
    const utilizadores = JSON.parse(
      localStorage.getItem('utilizadores') || '[]'
    );

    const emailNormalizado = this.email.trim().toLowerCase();

    const existe = utilizadores.some(
      (u: any) => u.email === emailNormalizado
    );

    if (existe) {
      alert('Já existe uma conta com este email.');
      return;
    }

    const utilizador = {
      nome: this.nome,
      email: emailNormalizado,
      contacto: this.contacto,
      morada: this.morada,
      password: this.password,
      fotoPerfil: ''
    };

    utilizadores.push(utilizador);

    localStorage.setItem(
      'utilizadores',
      JSON.stringify(utilizadores)
    );

    alert('Conta criada com sucesso!');

    this.router.navigate(['/login']);
  }

  irLogin() {
    this.router.navigate(['/login']);
  }
}