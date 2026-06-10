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
// Página de Perfil: exibe dados do utilizador,
// permite alterar foto de perfil, e oferece opção de logout.
export class Tab4Page {

  
  fotoPerfil = '';

  // Email do utilizador
  emailAtual: string | null = null;

  // Objeto com todos os dados do utilizador
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
    // Carrega email e depois procura os dados do utilizador na lista
    this.emailAtual = await this.storageService.get('utilizadorAtual');

    if (!this.emailAtual) {
      this.router.navigate(['/login']);
      return;
    }

    const utilizadores = await this.storageService.get('utilizadores') || [];

    // Encontra o utilizador com login pelo email
    const utilizadorEncontrado = utilizadores.find(
      (u: any) => u.email === this.emailAtual
    );

    if (utilizadorEncontrado) {
      this.utilizador = utilizadorEncontrado;
      this.fotoPerfil = utilizadorEncontrado.fotoPerfil || '';
    }
  }

  async terminarSessao() {
    // Remove a chave de utilizador com lgoin feito e volta ao login
    await this.storageService.remove('utilizadorAtual');
    this.router.navigate(['/login']);
  }

   voltar() {
    this.router.navigate(['/tabs/tab1']);
  }

  selecionarFoto(event: any) {
    // Lê ficheiro de imagem, e guarda no perfil
    const ficheiro = event.target.files[0];

    if (!ficheiro) {
      return;
    }

    const reader = new FileReader();

    reader.onload = async () => {
      this.fotoPerfil = reader.result as string;

      const utilizadores = await this.storageService.get('utilizadores') || [];

      // Encontra o índice do utilizador atual na lista
      const index = utilizadores.findIndex(
        (u: any) => u.email === this.emailAtual
      );

      if (index !== -1) {
        // Atualiza a foto no objeto utilizador e guarda tudo
        utilizadores[index].fotoPerfil = this.fotoPerfil;

        await this.storageService.set('utilizadores', utilizadores);

        this.utilizador = utilizadores[index];
      }
    };

    reader.readAsDataURL(ficheiro);
  }
}