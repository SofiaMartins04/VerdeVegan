import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personCircleOutline, arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonIcon
  ]
})
export class Tab4Page {

  fotoPerfil = '';

  utilizador: any = {
    nome: '',
    email: '',
    contacto: '',
    morada: '',
    fotoPerfil: ''
  };

  constructor(private router: Router) {
    addIcons({
      personCircleOutline,
      arrowBackOutline
    });
  }

  ionViewWillEnter() {
    const emailAtual = localStorage.getItem('utilizadorAtual');

    if (!emailAtual) {
      this.router.navigate(['/login']);
      return;
    }

    const utilizadores = JSON.parse(
      localStorage.getItem('utilizadores') || '[]'
    );

    const utilizadorEncontrado = utilizadores.find(
      (u: any) => u.email === emailAtual
    );

    if (utilizadorEncontrado) {
      this.utilizador = utilizadorEncontrado;
      this.fotoPerfil = utilizadorEncontrado.fotoPerfil || '';
    }
  }

  terminarSessao() {
    localStorage.removeItem('utilizadorAtual');
    this.router.navigate(['/login']);
  }

  voltar() {
    this.router.navigate(['/tabs/tab1']);
  }

  selecionarFoto(event: any) {
    const ficheiro = event.target.files[0];

    if (!ficheiro) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      this.fotoPerfil = reader.result as string;

      const emailAtual = localStorage.getItem('utilizadorAtual');

      const utilizadores = JSON.parse(
        localStorage.getItem('utilizadores') || '[]'
      );

      const index = utilizadores.findIndex(
        (u: any) => u.email === emailAtual
      );

      if (index !== -1) {
        utilizadores[index].fotoPerfil = this.fotoPerfil;

        localStorage.setItem(
          'utilizadores',
          JSON.stringify(utilizadores)
        );
      }
    };

    reader.readAsDataURL(ficheiro);
  }
}