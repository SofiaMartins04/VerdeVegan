import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonContent,IonItem, IonInput, IonButton, IonIcon} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, keyOutline, eyeOutline, eyeOffOutline} from 'ionicons/icons';

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

  mostrarPopup = false;
  mensagemPopup = '';
  tipoPopup: 'sucesso' | 'erro' = 'sucesso';

  constructor(private router: Router) {
    addIcons({ mailOutline, keyOutline, eyeOutline, eyeOffOutline });
  }

  alterarVisibilidadePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  async entrar() {
    const utilizadores = JSON.parse(
      localStorage.getItem('utilizadores') || '[]'
    );

    if (utilizadores.length === 0) {
      this.abrirPopup('Não existe nenhuma conta registada.', 'erro');
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

      this.abrirPopup('Login efetuado com sucesso!', 'sucesso');
      this.router.navigate(['/tabs/tab1']);
    } else {
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