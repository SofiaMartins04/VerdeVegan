import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonIcon
} from '@ionic/angular/standalone';
import { arrowBackOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonIcon
  ],
})

export class Tab2Page {

  constructor(private router: Router) {
    addIcons({
      arrowBackOutline
    });

  }

  pedidos: any[] = [];

  ionViewWillEnter() {
    this.carregarPedidos();
  }

  get emailAtual() {
    return localStorage.getItem('utilizadorAtual');
  }

  get chavePedidos() {
    return `pedidos_${this.emailAtual}`;
  }

  carregarPedidos() {
    const dados = localStorage.getItem(this.chavePedidos);
    this.pedidos = dados ? JSON.parse(dados) : [];
  }

  get pedidosAtivos() {
    return this.pedidos.filter(pedido => pedido.estado !== 'Entregue');
  }

  get historicoPedidos() {
    return this.pedidos
      .filter(pedido => pedido.estado === 'Entregue')
      .slice(-4)
      .reverse();
  }

  marcarComoEntregue(id: number) {
    const index = this.pedidos.findIndex(pedido => pedido.id === id);

    if (index !== -1) {
      this.pedidos[index].estado = 'Entregue';

      localStorage.setItem(
        this.chavePedidos,
        JSON.stringify(this.pedidos)
      );

      this.carregarPedidos();
    }
  }

  totalArtigos(pedido: any) {
    return pedido.itens.reduce((total: number, item: any) => {
      return total + item.quantidade;
    }, 0);
  }

  voltar() {
    this.router.navigate(['/tabs/tab1']);
  }
}