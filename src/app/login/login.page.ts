import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  mailOutline,
  keyOutline,
  eyeOutline,
  eyeOffOutline
} from 'ionicons/icons';

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
export class LoginPage {
  email = '';
  password = '';
  mostrarPassword = false;

  constructor(private router: Router) {
    addIcons({
      mailOutline,
      keyOutline,
      eyeOutline,
      eyeOffOutline
    });
  }

  alterarVisibilidadePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  entrar() {
    const utilizadores = JSON.parse(
      localStorage.getItem('utilizadores') || '[]'
    );

    if (utilizadores.length === 0) {
      alert('Não existe nenhuma conta registada.');
      return;
    }

    const emailNormalizado = this.email.trim().toLowerCase();

    const utilizador = utilizadores.find(
      (u: any) =>
        u.email === emailNormalizado &&
        u.password === this.password
    );

    if (utilizador) {
      localStorage.setItem(
        'utilizadorAtual',
        utilizador.email
      );

      alert('Login efetuado com sucesso!');

      this.router.navigate(['/tabs/tab1']);
    } else {
      alert('Email ou palavra-passe incorretos.');
    }
  }
}