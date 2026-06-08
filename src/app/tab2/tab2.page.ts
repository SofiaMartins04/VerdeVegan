import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonIcon
} from '@ionic/angular/standalone';
import { arrowBackOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { StorageService } from '../services/storage';

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

  pedidos: any[] = [];
  emailAtual: string | null = null;

  constructor(
    private router: Router,
    private storageService: StorageService
  ) {
    addIcons({
      arrowBackOutline
    });
  }

  get chavePedidos() {
    return `pedidos_${this.emailAtual}`;
  }

  async ionViewWillEnter() {
    this.emailAtual = await this.storageService.get('utilizadorAtual');

    if (!this.emailAtual) {
      this.router.navigate(['/login']);
      return;
    }

    await this.carregarPedidos();
  }

  async carregarPedidos() {
    this.pedidos = await this.storageService.get(this.chavePedidos) || [];
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

  async marcarComoEntregue(id: number) {
    const index = this.pedidos.findIndex(pedido => pedido.id === id);

    if (index !== -1) {
      this.pedidos[index].estado = 'Entregue';

      await this.storageService.set(this.chavePedidos, this.pedidos);

      await this.carregarPedidos();
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