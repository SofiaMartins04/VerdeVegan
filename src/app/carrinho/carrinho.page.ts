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
  recompensasDisponiveis: any[] = [];

  modalRecompensaAberto = false;
  recompensaSelecionada: any = null;
  opcoesRecompensa: any[] = [];
  mostrarPopup = false;
  mensagemPopup = '';
  tipoPopup: 'sucesso' | 'erro' = 'sucesso';

  constructor(private router: Router) {
    addIcons({
      cartOutline,
      arrowBackOutline
    });
  }

  get emailAtual() {
    return localStorage.getItem('utilizadorAtual');
  }

  get chaveCarrinho() {
    return `carrinho_${this.emailAtual}`;
  }

  get chaveRecompensas() {
    return `recompensas_${this.emailAtual}`;
  }

  ionViewWillEnter() {
    const dados = localStorage.getItem(this.chaveCarrinho);
    this.carrinho = dados ? JSON.parse(dados) : [];

    const recompensas = localStorage.getItem(this.chaveRecompensas);
    this.recompensasDisponiveis = recompensas ? JSON.parse(recompensas) : [];
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

  guardarRecompensas() {
    localStorage.setItem(
      this.chaveRecompensas,
      JSON.stringify(this.recompensasDisponiveis)
    );
  }

  usarRecompensa(recompensa: any) {

    this.recompensaSelecionada = recompensa;

    const produtos = JSON.parse(
      localStorage.getItem('produtos') || '[]'
    );

    if (recompensa.tipo === 'cafe') {
      this.opcoesRecompensa = produtos.filter((p: any) =>
        p.categoria === 'extras' &&
        p.nome.toLowerCase().includes('café')
      );
    }

    if (recompensa.tipo === 'bebida') {
      this.opcoesRecompensa = produtos.filter((p: any) =>
        p.categoria === 'extras' &&
        !p.nome.toLowerCase().includes('café')
      );
    }

    if (recompensa.tipo === 'sobremesa') {
      this.opcoesRecompensa = produtos.filter((p: any) =>
        p.categoria === 'sobremesas'
      );
    }

    if (recompensa.tipo === 'refeicao') {
      this.opcoesRecompensa = produtos.filter((p: any) =>
        p.categoria === 'pratos' || p.categoria === 'fastfood'
      );
    }

    this.modalRecompensaAberto = true;
  }

  selecionarProdutoRecompensa(produto: any) {
    this.carrinho.push({
      nome: produto.nome,
      preco: '0.00€',
      imagem: produto.imagem,
      quantidade: 1,
      pontos: 0,
      recompensa: true,
      tipoRecompensa: this.recompensaSelecionada.tipo,
      ingredientesRemovidos: []
    });

    this.recompensasDisponiveis = this.recompensasDisponiveis.filter(
      r => r.id !== this.recompensaSelecionada.id
    );

    this.guardarCarrinho();
    this.guardarRecompensas();

    this.modalRecompensaAberto = false;
    this.recompensaSelecionada = null;
    this.opcoesRecompensa = [];
  }

  cancelarRecompensa(index: number) {
    const item = this.carrinho[index];

    let pontosDevolver = 0;

    switch (item.tipoRecompensa) {
      case 'cafe':
        pontosDevolver = 10;
        break;

      case 'bebida':
        pontosDevolver = 30;
        break;

      case 'sobremesa':
        pontosDevolver = 60;
        break;

      case 'refeicao':
        pontosDevolver = 100;
        break;
    }

    const chavePontos = `pontos_${this.emailAtual}`;
    const pontosAtuais = Number(localStorage.getItem(chavePontos) || 0);

    localStorage.setItem(
      chavePontos,
      String(pontosAtuais + pontosDevolver)
    );

    this.carrinho.splice(index, 1);

    this.guardarCarrinho();

    this.abrirPopup('Recompensa removida e pontos devolvidos.', 'sucesso');
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
    if (this.carrinho[index].recompensa) {
      return;
    }

    if (this.carrinho[index].quantidade >= 10) {
      this.abrirPopup('Quantidade máxima atingida (10).', 'erro');
      return;
    }

    this.carrinho[index].quantidade++;
    this.guardarCarrinho();
  }

  diminuirQuantidade(index: number) {
    if (this.carrinho[index].recompensa) {
      this.removerProduto(index);
      return;
    }

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
      this.abrirPopup('O carrinho está vazio.', 'erro');
      return;
    }

    this.router.navigate(['/pagamento']);
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