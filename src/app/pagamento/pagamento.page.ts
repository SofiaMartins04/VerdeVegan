import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, cardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-pagamento',
  templateUrl: './pagamento.page.html',
  styleUrls: ['./pagamento.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonIcon
  ]
})
export class PagamentoPage {

  nome = '';
  morada = '';
  codigoPostal = '';
  localidade = '';
  nif = '';

  nomeCartao = '';
  numeroCartao = '';
  validade = '';
  cvv = '';

  carrinho: any[] = [];

  constructor(private router: Router) {
    addIcons({
      arrowBackOutline,
      cardOutline
    });
  }

  get emailAtual() {
    return localStorage.getItem('utilizadorAtual');
  }

  get chaveCarrinho() {
    return `carrinho_${this.emailAtual}`;
  }

  get chavePedidos() {
    return `pedidos_${this.emailAtual}`;
  }

  ionViewWillEnter() {
    if (!this.emailAtual) {
      this.router.navigate(['/login']);
      return;
    }

    const dadosCarrinho = localStorage.getItem(this.chaveCarrinho);
    this.carrinho = dadosCarrinho ? JSON.parse(dadosCarrinho) : [];

    const utilizadores = JSON.parse(localStorage.getItem('utilizadores') || '[]');

    const utilizador = utilizadores.find(
      (u: any) => u.email === this.emailAtual
    );

    if (utilizador) {
      this.nome = utilizador.nome;
      this.morada = utilizador.morada;
    }
  }

  get total() {
    return this.carrinho.reduce((soma, item) => {
      const preco = parseFloat(item.preco.replace('€', ''));
      return soma + preco * item.quantidade;
    }, 0);
  }

  voltar() {
    this.router.navigate(['/carrinho']);
  }

  finalizarPagamento() {
    if (
      !this.nome ||
      !this.morada ||
      !this.codigoPostal ||
      !this.localidade ||
      !this.nomeCartao ||
      !this.numeroCartao ||
      !this.validade ||
      !this.cvv
    ) {
      alert('Preenche todos os campos obrigatórios.');
      return;
    }

    if (this.carrinho.length === 0) {
      alert('O carrinho está vazio.');
      this.router.navigate(['/tabs/tab1']);
      return;
    }

    const pedidos = JSON.parse(
      localStorage.getItem(this.chavePedidos) || '[]'
    );

    const novoPedido = {
      id: Date.now(),
      data: new Date().toLocaleString('pt-PT'),
      estado: 'A caminho',
      nome: this.nome,
      morada: this.morada,
      codigoPostal: this.codigoPostal,
      localidade: this.localidade,
      nif: this.nif,
      itens: this.carrinho,
      total: this.total
    };

    pedidos.push(novoPedido);

    localStorage.setItem(
      this.chavePedidos,
      JSON.stringify(pedidos)
    );

    localStorage.removeItem(this.chaveCarrinho);

    window.dispatchEvent(new Event('carrinhoAtualizado'));

    alert('Encomenda realizada com sucesso!');

    this.router.navigate(['/tabs/tab2']);
  }
}