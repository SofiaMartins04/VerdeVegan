import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  cartOutline,
  arrowBackOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.page.html',
  styleUrls: ['./carrinho.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonIcon
  ]
})
export class CarrinhoPage {

  carrinho: any[] = [];

  constructor(private router: Router) {
    addIcons({
      cartOutline,
      arrowBackOutline
    });
  }

  get chaveCarrinho() {
    const emailAtual = localStorage.getItem('utilizadorAtual');
    return `carrinho_${emailAtual}`;
  }

  ionViewWillEnter() {
    const dados = localStorage.getItem(this.chaveCarrinho);

    if (dados) {
      this.carrinho = JSON.parse(dados);
    } else {
      this.carrinho = [];
    }
  }

  fechar() {
    this.router.navigate(['/tabs/tab1']);
  }

  get total() {
    return this.carrinho.reduce((soma, item) => {
      const preco = parseFloat(item.preco.replace('€', ''));
      return soma + (preco * item.quantidade);
    }, 0);
  }

  guardarCarrinho() {
    localStorage.setItem(
      this.chaveCarrinho,
      JSON.stringify(this.carrinho)
    );

    window.dispatchEvent(new Event('carrinhoAtualizado'));
  }

  removerProduto(index: number) {
    this.carrinho.splice(index, 1);
    this.guardarCarrinho();
  }

  limparCarrinho() {
    this.carrinho = [];
    localStorage.removeItem(this.chaveCarrinho);
    window.dispatchEvent(new Event('carrinhoAtualizado'));
  }

  aumentarQuantidade(index: number) {
    if (this.carrinho[index].quantidade >= 10) {
      alert('Quantidade máxima atingida (10).');
      return;
    }

    this.carrinho[index].quantidade++;
    this.guardarCarrinho();
  }

  diminuirQuantidade(index: number) {
    if (this.carrinho[index].quantidade > 1) {
      this.carrinho[index].quantidade--;
    } else {
      this.carrinho.splice(index, 1);
    }

    this.guardarCarrinho();
  }

  adicionarPrato() {
    this.router.navigate(['/tabs/tab1']);
  }

  irPagamento() {
    if (this.carrinho.length === 0) {
      alert('O carrinho está vazio.');
      return;
    }

    this.router.navigate(['/pagamento']);
  }
}