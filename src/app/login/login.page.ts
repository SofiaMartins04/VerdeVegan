import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonItem, IonInput, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, keyOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { StorageService } from '../services/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonIcon,
    CommonModule,
    FormsModule,
    RouterLink
  ]
})
// Página de login: entrada do utilizador e feedback (validação simples + popup)
export class LoginPage {
  // Dados do formulário
  email = '';
  password = '';

  // Controla visibilidade da password (true = mostrar como texto)
  mostrarPassword = false;

  // Popup de feedback usado para sucesso/erro
  mostrarPopup = false;
  mensagemPopup = '';
  tipoPopup: 'sucesso' | 'erro' = 'sucesso';

  constructor(
    private router: Router,
    private storageService: StorageService
  ) {
    addIcons({ mailOutline, keyOutline, eyeOutline, eyeOffOutline });
  }

  alterarVisibilidadePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  // Tenta autenticar o utilizador com os dados guardados em Storage
  async entrar() {
    // Lê lista de utilizadores registados
    const utilizadores = await this.storageService.get('utilizadores') || [];

    // Validação básica: verifica se existe pelo menos uma conta
    if (utilizadores.length === 0) {
      this.abrirPopup('Não existe nenhuma conta registada.', 'erro');
      return;
    }

    // Normaliza email (case-insensitive)
    const emailNormalizado = this.email.trim().toLowerCase();

    // Procura utilizador com email e password coincidentes
    const utilizador = utilizadores.find(
      (u: any) =>
        u.email === emailNormalizado &&
        u.password === this.password
    );

    if (utilizador) {
      // Guarda o email do utilizador logado (session)
      await this.storageService.set('utilizadorAtual', utilizador.email);

      this.abrirPopup('Login efetuado com sucesso!', 'sucesso');
      this.router.navigate(['/tabs/tab1']);
    } else {
      // Email ou password incorretos
      this.abrirPopup('Email ou palavra-passe incorretos.', 'erro');
    }
  }

  abrirPopup(mensagem: string, tipo: 'sucesso' | 'erro' = 'sucesso') {
    this.mensagemPopup = mensagem;
    this.tipoPopup = tipo;
    this.mostrarPopup = true;
  }

  fecharPopup() {
    this.mostrarPopup = false;
  }
}