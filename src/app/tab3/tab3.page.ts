import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import {
  IonContent,
  IonIcon
} from '@ionic/angular/standalone';

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

  constructor(private router: Router) {
      addIcons({
        arrowBackOutline
      });
    }
  
  recompensasDisponiveis: any[] = [];

  recompensas = [
    { tipo: 'cafe', nome: 'Café grátis', custo: 10 },
    { tipo: 'bebida', nome: 'Bebida grátis', custo: 30},
    { tipo: 'sobremesa', nome: 'Sobremesa grátis', custo: 60 },
    { tipo: 'refeicao', nome: 'Refeição grátis', custo: 100 }
  ];

  ionViewWillEnter() {
    this.carregarRecompensas();
  }

  get emailAtual() {
    return localStorage.getItem('utilizadorAtual');
  }

  get chavePontos() {
    return `pontos_${this.emailAtual}`;
  }

  get chaveRecompensas() {
    return `recompensas_${this.emailAtual}`;
  }

  get pontos() {
    return Number(localStorage.getItem(this.chavePontos) || 0);
  }

  carregarRecompensas() {
    const dados = localStorage.getItem(this.chaveRecompensas);
    this.recompensasDisponiveis = dados ? JSON.parse(dados) : [];
  }

  resgatarRecompensa(recompensa: any) {
    if (this.pontos < recompensa.custo) {
      return;
    }

    const novosPontos = this.pontos - recompensa.custo;

    localStorage.setItem(
      this.chavePontos,
      String(novosPontos)
    );

    const recompensasGuardadas = JSON.parse(
      localStorage.getItem(this.chaveRecompensas) || '[]'
    );

    recompensasGuardadas.push({
      id: Date.now(),
      tipo: recompensa.tipo,
      nome: recompensa.nome,
      usado: false
    });

    localStorage.setItem(
      this.chaveRecompensas,
      JSON.stringify(recompensasGuardadas)
    );

    this.carregarRecompensas();

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