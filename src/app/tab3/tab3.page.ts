import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import {
  IonContent,
  IonIcon
} from '@ionic/angular/standalone';
import { StorageService } from '../services/storage';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonIcon
  ]
})
export class Tab3Page {

  mostrarPopup = false;
  mensagemPopup = '';
  tipoPopup: 'sucesso' | 'erro' = 'sucesso';

  recompensasDisponiveis: any[] = [];
  emailAtual: string | null = null;
  pontos = 0;

  recompensas = [
    { tipo: 'cafe', nome: 'Café grátis', custo: 10 },
    { tipo: 'bebida', nome: 'Bebida grátis', custo: 30 },
    { tipo: 'sobremesa', nome: 'Sobremesa grátis', custo: 60 },
    { tipo: 'refeicao', nome: 'Refeição grátis', custo: 100 }
  ];

  constructor(
    private router: Router,
    private storageService: StorageService
  ) {
    addIcons({
      arrowBackOutline
    });
  }

  get chavePontos() {
    return `pontos_${this.emailAtual}`;
  }

  get chaveRecompensas() {
    return `recompensas_${this.emailAtual}`;
  }

  async ionViewWillEnter() {
    this.emailAtual = await this.storageService.get('utilizadorAtual');

    if (!this.emailAtual) {
      this.router.navigate(['/login']);
      return;
    }

    await this.carregarPontos();
    await this.carregarRecompensas();
  }

  async carregarPontos() {
    this.pontos = Number(await this.storageService.get(this.chavePontos) || 0);
  }

  async carregarRecompensas() {
    this.recompensasDisponiveis = await this.storageService.get(this.chaveRecompensas) || [];
  }

  async resgatarRecompensa(recompensa: any) {
    if (this.pontos < recompensa.custo) {
      this.abrirPopup('Não tens pontos suficientes.', 'erro');
      return;
    }

    const novosPontos = this.pontos - recompensa.custo;

    await this.storageService.set(this.chavePontos, novosPontos);

    const recompensasGuardadas = await this.storageService.get(this.chaveRecompensas) || [];

    recompensasGuardadas.push({
      id: Date.now(),
      tipo: recompensa.tipo,
      nome: recompensa.nome,
      usado: false
    });

    await this.storageService.set(this.chaveRecompensas, recompensasGuardadas);

    await this.carregarPontos();
    await this.carregarRecompensas();

    this.abrirPopup('Recompensa adicionada à tua conta!', 'sucesso');
  }

  voltar() {
    this.router.navigate(['/tabs/tab1']);
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