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
import { StorageService } from '../services/storage';

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
  emailAtual: string | null = null;

  modalRecompensaAberto = false;
  recompensaSelecionada: any = null;
  opcoesRecompensa: any[] = [];
  mostrarPopup = false;
  mensagemPopup = '';
  tipoPopup: 'sucesso' | 'erro' = 'sucesso';

  constructor(
    private router: Router,
    private storageService: StorageService
  ) {
    addIcons({
      cartOutline,
      arrowBackOutline
    });
  }

  get chaveCarrinho() {
    return `carrinho_${this.emailAtual}`;
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

    this.carrinho = await this.storageService.get(this.chaveCarrinho) || [];
    this.recompensasDisponiveis = await this.storageService.get(this.chaveRecompensas) || [];
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

  async guardarCarrinho() {
    await this.storageService.set(this.chaveCarrinho, this.carrinho);
    window.dispatchEvent(new Event('carrinhoAtualizado'));
  }

  async guardarRecompensas() {
    await this.storageService.set(this.chaveRecompensas, this.recompensasDisponiveis);
  }

  async usarRecompensa(recompensa: any) {
    this.recompensaSelecionada = recompensa;

    const produtos = await this.storageService.get('produtos') || [];

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

  async selecionarProdutoRecompensa(produto: any) {
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

    await this.guardarCarrinho();
    await this.guardarRecompensas();

    this.modalRecompensaAberto = false;
    this.recompensaSelecionada = null;
    this.opcoesRecompensa = [];
  }

  async cancelarRecompensa(index: number) {
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
    const pontosAtuais = Number(await this.storageService.get(chavePontos) || 0);

    await this.storageService.set(
      chavePontos,
      pontosAtuais + pontosDevolver
    );

    this.carrinho.splice(index, 1);

    await this.guardarCarrinho();

    this.abrirPopup('Recompensa removida e pontos devolvidos.', 'sucesso');
  }

  async removerProduto(index: number) {
    this.carrinho.splice(index, 1);
    await this.guardarCarrinho();
  }

  async limparCarrinho() {
    this.carrinho = [];
    await this.storageService.remove(this.chaveCarrinho);
    window.dispatchEvent(new Event('carrinhoAtualizado'));
  }

  async aumentarQuantidade(index: number) {
    if (this.carrinho[index].recompensa) {
      return;
    }

    if (this.carrinho[index].quantidade >= 10) {
      this.abrirPopup('Quantidade máxima atingida (10).', 'erro');
      return;
    }

    this.carrinho[index].quantidade++;
    await this.guardarCarrinho();
  }

  async diminuirQuantidade(index: number) {
    if (this.carrinho[index].recompensa) {
      await this.removerProduto(index);
      return;
    }

    if (this.carrinho[index].quantidade > 1) {
      this.carrinho[index].quantidade--;
    } else {
      this.carrinho.splice(index, 1);
    }

    await this.guardarCarrinho();
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