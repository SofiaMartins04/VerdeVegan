import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personCircleOutline, arrowBackOutline } from 'ionicons/icons';
import { StorageService } from '../services/storage';

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
  emailAtual: string | null = null;

  utilizador: any = {
    nome: '',
    email: '',
    contacto: '',
    morada: '',
    fotoPerfil: ''
  };

  constructor(
    private router: Router,
    private storageService: StorageService
  ) {
    addIcons({
      personCircleOutline,
      arrowBackOutline
    });
  }

  async ionViewWillEnter() {
    this.emailAtual = await this.storageService.get('utilizadorAtual');

    if (!this.emailAtual) {
      this.router.navigate(['/login']);
      return;
    }

    const utilizadores = await this.storageService.get('utilizadores') || [];

    const utilizadorEncontrado = utilizadores.find(
      (u: any) => u.email === this.emailAtual
    );

    if (utilizadorEncontrado) {
      this.utilizador = utilizadorEncontrado;
      this.fotoPerfil = utilizadorEncontrado.fotoPerfil || '';
    }
  }

  async terminarSessao() {
    await this.storageService.remove('utilizadorAtual');
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

    reader.onload = async () => {
      this.fotoPerfil = reader.result as string;

      const utilizadores = await this.storageService.get('utilizadores') || [];

      const index = utilizadores.findIndex(
        (u: any) => u.email === this.emailAtual
      );

      if (index !== -1) {
        utilizadores[index].fotoPerfil = this.fotoPerfil;

        await this.storageService.set('utilizadores', utilizadores);

        this.utilizador = utilizadores[index];
      }
    };

    reader.readAsDataURL(ficheiro);
  }
}