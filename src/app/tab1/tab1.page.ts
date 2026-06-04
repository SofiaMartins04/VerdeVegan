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

  produtos = [
    {
      nome: 'Arroz de couve-flor com cogumelos',
      preco: '15.99€',
      tempo: '20 min',
      rating: 4.0,
      categoria: 'saudavel',
      destaque: true,
      imagem: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
      descricao: 'Uma opção leve e nutritiva, preparada com arroz de couve-flor, cogumelos salteados e legumes frescos para uma refeição equilibrada.',
      ingredientes: [
        'couve-flor',
        'cogumelos frescos',
        'alho-francês',
        'espinafres',
        'brócolos',
        'azeite',
        'sal',
        'pimenta'
      ],
      ingredientesPersonalizaveis: [
        'cogumelos frescos',
        'alho-francês',
        'espinafres',
        'brócolos',
        'sal',
        'pimenta'
      ]
    },
    {
      nome: 'Fricassé de cogumelos e curgete',
      preco: '14.99€',
      tempo: '15 min',
      rating: 4.5,
      categoria: 'saudavel',
      destaque: true,
      imagem: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
      descricao: 'Um prato cremoso e reconfortante, com cogumelos e curgete envolvidos num molho vegetal suave e aromático.',
      ingredientes: [
        'cogumelos',
        'curgete',
        'cebola',
        'alho',
        'bebida vegetal',
        'sumo de limão',
        'salsa',
        'azeite',
        'sal',
        'pimenta'
      ],
      ingredientesPersonalizaveis: [
        'cogumelos',
        'curgete',
        'cebola',
        'salsa',
        'sal',
        'pimenta'
      ]
    },
    {
      nome: 'Gelado com bolacha Maria',
      preco: '6.99€',
      tempo: '15 min',
      rating: 4.8,
      categoria: 'sobremesas',
      destaque: true,
      imagem: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb',
      descricao: 'Uma sobremesa fresca e doce, combinando gelado vegetal com bolacha Maria triturada para uma textura crocante.',
      ingredientes: [
        'gelado vegetal de baunilha',
        'bolacha Maria',
        'bebida vegetal',
        'canela',
        'raspas de chocolate negro',
        'xarope de agave'
      ],
      ingredientesPersonalizaveis: [
        'canela',
        'raspas de chocolate negro',
        'xarope de agave'
      ]
    },
    {
      nome: 'Cuscuz com vegetais',
      preco: '12.99€',
      tempo: '20 min',
      rating: 4.2,
      categoria: 'saudavel',
      destaque: true,
      imagem: 'https://images.unsplash.com/photo-1529059997568-3d847b1154f0',
      descricao: 'Cuscuz leve e colorido, preparado com legumes salteados e temperos mediterrânicos para uma refeição simples e saborosa.',
      ingredientes: [
        'cuscuz',
        'pimento vermelho',
        'pimento amarelo',
        'curgete',
        'cenoura',
        'grão-de-bico',
        'azeite',
        'salsa',
        'sumo de limão',
        'sal'
      ],
      ingredientesPersonalizaveis: [
        'pimento vermelho',
        'pimento amarelo',
        'curgete',
        'cenoura',
        'grão-de-bico',
        'salsa',
        'sal'
      ]
    },
    {
      nome: 'Arroz de forno vegetariano',
      preco: '13.99€',
      tempo: '25 min',
      rating: 3.9,
      categoria: 'pratos',
      destaque: false,
      imagem: 'https://images.unsplash.com/photo-1596797038530-2c107229654b',
      descricao: 'Um prato quente e completo, feito no forno com arroz, legumes e uma cobertura ligeiramente gratinada.',
      ingredientes: [
        'arroz',
        'cenoura',
        'ervilhas',
        'milho',
        'cogumelos',
        'tomate',
        'cebola',
        'alho',
        'queijo vegetal ralado',
        'azeite'
      ],
      ingredientesPersonalizaveis: [
        'cenoura',
        'ervilhas',
        'milho',
        'cogumelos',
        'tomate',
        'cebola',
        'queijo vegetal ralado'
      ]
    },
    {
      nome: 'Arroz frito com legumes',
      preco: '11.99€',
      tempo: '20 min',
      rating: 3.8,
      categoria: 'pratos',
      destaque: false,
      imagem: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b',
      descricao: 'Arroz salteado com legumes crocantes e molho de soja, ideal para uma refeição rápida e cheia de sabor.',
      ingredientes: [
        'arroz basmati',
        'cenoura',
        'ervilhas',
        'milho',
        'pimento',
        'cebolinho',
        'molho de soja',
        'óleo de sésamo',
        'alho',
        'gengibre'
      ],
      ingredientesPersonalizaveis: [
        'cenoura',
        'ervilhas',
        'milho',
        'pimento',
        'cebolinho',
        'molho de soja'
      ]
    },
    {
      nome: 'Hambúrguer vegan',
      preco: '10.99€',
      tempo: '15 min',
      rating: 5,
      categoria: 'fastfood',
      destaque: false,
      imagem: 'https://images.unsplash.com/photo-1520072959219-c595dc870360',
      descricao: 'Hambúrguer vegan suculento, servido em pão macio com vegetais frescos e molho especial da casa.',
      ingredientes: [
        'pão de hambúrguer',
        'hambúrguer vegetal',
        'alface',
        'tomate',
        'cebola roxa',
        'pepino em pickle',
        'molho vegan',
        'queijo vegetal'
      ],
      ingredientesPersonalizaveis: [
        'alface',
        'tomate',
        'cebola roxa',
        'pepino em pickle',
        'molho vegan',
        'queijo vegetal'
      ]
    },
    {
      nome: 'Tosta vegan',
      preco: '7.99€',
      tempo: '10 min',
      rating: 4.9,
      categoria: 'fastfood',
      destaque: false,
      imagem: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af',
      descricao: 'Tosta crocante e simples, recheada com queijo vegetal, tomate e ervas aromáticas.',
      ingredientes: [
        'pão de forma',
        'queijo vegetal',
        'tomate',
        'orégãos',
        'rúcula',
        'azeite',
        'manteiga vegetal'
      ],
      ingredientesPersonalizaveis: [
        'queijo vegetal',
        'tomate',
        'orégãos',
        'rúcula',
        'manteiga vegetal'
      ]
    },
    {
      nome: 'Brownie vegan',
      preco: '5.99€',
      tempo: '10 min',
      rating: 5,
      categoria: 'sobremesas',
      destaque: false,
      imagem: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c',
      descricao: 'Brownie vegan intenso e húmido, feito com cacau e chocolate negro, perfeito para amantes de sobremesas.',
      ingredientes: [
        'farinha',
        'cacau em pó',
        'chocolate negro',
        'açúcar mascavado',
        'bebida vegetal',
        'óleo de coco',
        'fermento',
        'nozes'
      ],
      ingredientesPersonalizaveis: [
        'açúcar mascavado',
        'nozes'
      ]
    },
    {
      nome: 'Panquecas vegan',
      preco: '6.50€',
      tempo: '15 min',
      rating: 4.4,
      categoria: 'sobremesas',
      destaque: false,
      imagem: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93',
      descricao: 'Panquecas fofas feitas sem produtos de origem animal, servidas com fruta fresca e topping doce.',
      ingredientes: [
        'farinha de aveia',
        'banana',
        'bebida vegetal',
        'fermento',
        'canela',
        'frutos vermelhos',
        'xarope de agave'
      ],
      ingredientesPersonalizaveis: [
        'canela',
        'frutos vermelhos',
        'xarope de agave'
      ]
    }
  ];

  constructor(private router: Router) {
    addIcons({
      cartOutline,
      searchOutline
    });

    this.atualizarQuantidadeCarrinho();

    window.addEventListener('carrinhoAtualizado', () => {
      this.atualizarQuantidadeCarrinho();
    });

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
      case 'saudavel':
        return 'Saudável';
      case 'pratos':
        return 'Pratos';
      case 'sobremesas':
        return 'Sobremesas';
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

  abrirDetalhes(produto: any) {
    localStorage.setItem('produtoSelecionado', JSON.stringify(produto));
    this.router.navigate(['/detalhe-menu']);
  }

  gerarEstrelas(rating: number): string {

    const estrelasCheias = Math.floor(rating);
    const estrelasVazias = 5 - estrelasCheias;

    return '★'.repeat(estrelasCheias) +
          '☆'.repeat(estrelasVazias);
  }

  ionViewWillEnter() {
    this.atualizarQuantidadeCarrinho();
  }

  ionViewDidEnter() {
    this.atualizarQuantidadeCarrinho();
  }

  atualizarQuantidadeCarrinho() {
    const emailAtual = localStorage.getItem('utilizadorAtual');

    if (!emailAtual) {
      this.quantidadeCarrinho = 0;
      return;
    }

    const chaveCarrinho = `carrinho_${emailAtual}`;

    const carrinho = JSON.parse(
      localStorage.getItem(chaveCarrinho) || '[]'
    );

    this.quantidadeCarrinho = carrinho.reduce((total: number, item: any) => {
      return total + item.quantidade;
    }, 0);
  }

  abrirCarrinho() {
    this.router.navigate(['/carrinho']);
  }
}