import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonIcon
} from '@ionic/angular/standalone';
import { StorageService } from '../services/storage';

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
// Página de registo: valida campos, cria conta e guarda em Storage.
export class RegistarPage {

  // Dados do formulário (campos que o utilizador preenche)
  nome = '';
  email = '';
  contacto = '';
  morada = '';
  password = '';

  // Controla se a password é visível (UI)
  mostrarPassword = false;

  // Popup de feedback exibido após ações importantes
  mostrarPopup = false;
  mensagemPopup = '';
  tipoPopup: 'sucesso' | 'erro' = 'sucesso';

  // Flags de validação — true indica erro no respetivo campo
  erroNome = false;
  erroEmail = false;
  erroContacto = false;
  erroMorada = false;
  erroPassword = false;

  constructor(
    private router: Router,
    private storageService: StorageService
  ) {}

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  // Valida inputs e cria um novo utilizador no Storage se estiver tudo OK.
  async registar() {
    // Nome obrigatório (não vazio)
    this.erroNome = !this.nome.trim();

    // Email: formato básico (ex: user@dominio.com)
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.erroEmail = !regexEmail.test(this.email.trim());

    // Telefone: formato nacional com 9 dígitos a começar por 9
    const regexTelefone = /^9\d{8}$/;
    this.erroContacto = !regexTelefone.test(this.contacto.trim());

    // Morada obrigatória
    this.erroMorada = !this.morada.trim();

    // Password mínima de 6 caracteres
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

    // Lê lista atual de utilizadores do Storage
    const utilizadores = await this.storageService.get('utilizadores') || [];

    // Normaliza email para comparação (case-insensitive)
    const emailNormalizado = this.email.trim().toLowerCase();

    // Verifica se já existe conta com este email
    const existe = utilizadores.some(
      (u: any) => u.email === emailNormalizado
    );

    if (existe) {
      this.abrirPopup('Já existe uma conta com este email.', 'erro');
      return;
    }

    // Prepara objeto do novo utilizador
    const utilizador = {
      nome: this.nome,
      email: emailNormalizado,
      contacto: this.contacto,
      morada: this.morada,
      password: this.password,
      fotoPerfil: ''
    };

    // Adiciona à lista e grava no Storage
    utilizadores.push(utilizador);

    await this.storageService.set('utilizadores', utilizadores);

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