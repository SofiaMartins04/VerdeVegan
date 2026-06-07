import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cartOutline, arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-detalhe-menu',
  templateUrl: './detalhe-menu.page.html',
  styleUrls: ['./detalhe-menu.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonIcon
  ]
})
export class DetalheMenuPage {

  produto: any;
  modalIngredientesAberto = false;
  ingredientesSelecionados: string[] = [];

  mostrarPopup = false;
  mensagemPopup = '';
  tipoPopup: 'sucesso' | 'erro' = 'sucesso';

  constructor(private router: Router) {
    addIcons({
      cartOutline, arrowBackOutline
    });

    this.atualizarQuantidadeCarrinho();

    const dados = localStorage.getItem('produtoSelecionado');

    if (dados) {
      this.produto = JSON.parse(dados);
      this.ingredientesSelecionados = [...this.produto.ingredientesPersonalizaveis];

    }
  }

  voltar() {
    this.router.navigate(['/tabs/tab1']);
  }
  
  gerarEstrelasArray(rating: number): string[] {
    const cheias = Math.floor(rating);
    const vazias = 5 - cheias;

    return [
      ...Array(cheias).fill('★'),
      ...Array(vazias).fill('☆')
    ];
  }

  abrirModalIngredientes() {
    this.modalIngredientesAberto = true;
  }

  fecharModalIngredientes() {
    this.modalIngredientesAberto = false;
  }

  ingredienteSelecionado(ingrediente: string): boolean {
    return this.ingredientesSelecionados.includes(ingrediente);
  }

  alterarIngrediente(ingrediente: string, event: any) {
    const checked = event.target.checked;

    if (checked) {
      this.ingredientesSelecionados.push(ingrediente);
    } else {
      this.ingredientesSelecionados =
        this.ingredientesSelecionados.filter(i => i !== ingrediente);
    }
  }

  guardarIngredientes() {
    this.modalIngredientesAberto = false;
  }

  get ingredientesRemovidos() {
    return this.produto.ingredientesPersonalizaveis.filter(
      (ingrediente: string) =>
        !this.ingredientesSelecionados.includes(ingrediente)
    );
  }

  adicionarAoCarrinho() {
    const emailAtual = localStorage.getItem('utilizadorAtual');

    if (!emailAtual) {
      this.abrirPopup('Tens de iniciar sessão primeiro.', 'erro');
      return;
    }

    const chaveCarrinho = `carrinho_${emailAtual}`;

    const carrinhoAtual = JSON.parse(
      localStorage.getItem(chaveCarrinho) || '[]'
    );

    const removidosOrdenados = [...this.ingredientesRemovidos].sort();

    const indexExistente = carrinhoAtual.findIndex((item: any) => {
      const removidosItem = [...(item.ingredientesRemovidos || [])].sort();

      return (
        item.nome === this.produto.nome &&
        JSON.stringify(removidosItem) === JSON.stringify(removidosOrdenados)
      );
    });

    if (indexExistente !== -1) {
      if (carrinhoAtual[indexExistente].quantidade < 10) {
        carrinhoAtual[indexExistente].quantidade++;
      } else {
        this.abrirPopup('Quantidade máxima atingida (10).', 'erro');
        return;
      }
    } else {
      carrinhoAtual.push({
        nome: this.produto.nome,
        preco: this.produto.preco,
        imagem: this.produto.imagem,
        quantidade: 1,
        pontos: this.produto.pontos,
        ingredientesRemovidos: this.ingredientesRemovidos
      });
    }

    localStorage.setItem(
      chaveCarrinho,
      JSON.stringify(carrinhoAtual)
    );

    this.atualizarQuantidadeCarrinho();

    window.dispatchEvent(new Event('carrinhoAtualizado'));
  }

  quantidadeCarrinho = 0;

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

  abrirPopup(mensagem: string, tipo: 'sucesso' | 'erro' = 'sucesso') {
    this.mensagemPopup = mensagem;
    this.tipoPopup = tipo;
    this.mostrarPopup = true;
  }

  fecharPopup() {
    this.mostrarPopup = false;

    if (this.mensagemPopup === 'Tens de iniciar sessão primeiro.') {
      this.router.navigate(['/login']);
    }
  }
}