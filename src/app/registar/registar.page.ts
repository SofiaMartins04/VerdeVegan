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

  mostrarPopup = false;
  mensagemPopup = '';
  tipoPopup: 'sucesso' | 'erro' = 'sucesso';

  erroNome = false;
  erroEmail = false;
  erroContacto = false;
  erroMorada = false;
  erroPassword = false;

  constructor( private router: Router) {}

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  async registar() {

    this.erroNome = !this.nome.trim();

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.erroEmail = !regexEmail.test(this.email.trim());

    const regexTelefone = /^9\d{8}$/;
    this.erroContacto = !regexTelefone.test(this.contacto.trim());

    this.erroMorada = !this.morada.trim();

    this.erroPassword = this.password.length < 6;

    if (
      this.erroNome ||
      this.erroEmail ||
      this.erroContacto ||
      this.erroMorada ||
      this.erroPassword
    ) {
      return;
    }
    const utilizadores = JSON.parse(
      localStorage.getItem('utilizadores') || '[]'
    );

    const emailNormalizado = this.email.trim().toLowerCase();

    const existe = utilizadores.some(
      (u: any) => u.email === emailNormalizado
    );

    if (existe) {
      this.abrirPopup('Já existe uma conta com este email.', 'erro');
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

    this.abrirPopup('Conta criada com sucesso!', 'sucesso');

  }

  irLogin() {
    this.router.navigate(['/login']);
  }

  abrirPopup(mensagem: string, tipo: 'sucesso' | 'erro' = 'sucesso') {
    this.mensagemPopup = mensagem;
    this.tipoPopup = tipo;
    this.mostrarPopup = true;
  }

  fecharPopup() {
    this.mostrarPopup = false;

    if (this.tipoPopup === 'sucesso') {
      this.router.navigate(['/login']);
    }
  }
}