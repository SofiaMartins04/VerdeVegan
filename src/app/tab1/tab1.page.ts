import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonInput,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  cartOutline,
  searchOutline
} from 'ionicons/icons';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage';
import { ProdutosService } from '../services/produtos';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonInput,
    IonIcon,
    CommonModule,
    FormsModule
  ],
})
export class Tab1Page {
  pesquisa = '';
  categoriaSelecionada = '';
  quantidadeCarrinho = 0;
  produtos: any[] = [];

  constructor(
    private router: Router,
    private storageService: StorageService,
    private produtosService: ProdutosService
  ) {
    addIcons({
      cartOutline,
      searchOutline
    });

    this.iniciarDados();

    window.addEventListener('carrinhoAtualizado', () => {
      this.atualizarQuantidadeCarrinho();
    });
  }

  async iniciarDados() {
    this.produtosService.getProdutos().subscribe(async (dados) => {
      this.produtos = dados;
      await this.storageService.set('produtos', this.produtos);
    });

    await this.atualizarQuantidadeCarrinho();
  }

  selecionarCategoria(categoria: string) {
    this.categoriaSelecionada = categoria;
    this.pesquisa = '';
  }

  limparFiltros() {
    this.categoriaSelecionada = '';
    this.pesquisa = '';
  }

  get tituloLista() {
    if (this.pesquisa.trim() !== '') {
      return 'Resultados da pesquisa';
    }

    switch (this.categoriaSelecionada) {
      case 'fastfood':
        return 'Fast Food';
      case 'pratos':
        return 'Pratos';
      case 'sobremesas':
        return 'Sobremesas';
      case 'extras':
        return 'Extras';
      default:
        return 'Em destaque';
    }
  }

  get produtosFiltrados() {
    const texto = this.pesquisa.toLowerCase().trim();

    if (texto !== '') {
      return this.produtos.filter(produto =>
        produto.nome.toLowerCase().includes(texto)
      );
    }

    if (this.categoriaSelecionada !== '') {
      return this.produtos.filter(produto =>
        produto.categoria === this.categoriaSelecionada
      );
    }

    return this.produtos.filter(produto => produto.destaque);
  }

  async abrirDetalhes(produto: any) {
    const index = this.produtos.findIndex(p => p.nome === produto.nome);
    this.router.navigate(['/detalhe-menu', index]);
  }

  gerarEstrelas(rating: number): string {

    const estrelasCheias = Math.floor(rating);
    const estrelasVazias = 5 - estrelasCheias;

    return '★'.repeat(estrelasCheias) + '☆'.repeat(estrelasVazias);
  }

  async ionViewWillEnter() {
    await this.atualizarQuantidadeCarrinho();
  }

  async ionViewDidEnter() {
    await this.atualizarQuantidadeCarrinho();
  }

  async atualizarQuantidadeCarrinho() {
    const emailAtual = await this.storageService.get('utilizadorAtual');

    if (!emailAtual) {
      this.quantidadeCarrinho = 0;
      return;
    }

    const chaveCarrinho = `carrinho_${emailAtual}`;
    const carrinho = await this.storageService.get(chaveCarrinho) || [];

    this.quantidadeCarrinho = carrinho.reduce((total: number, item: any) => {
      return total + item.quantidade;
    }, 0);
  }
  

  abrirCarrinho() {
    this.router.navigate(['/carrinho']);
  }
}