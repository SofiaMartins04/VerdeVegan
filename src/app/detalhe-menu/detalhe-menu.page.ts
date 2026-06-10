import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cartOutline, arrowBackOutline } from 'ionicons/icons';
import { StorageService } from '../services/storage';
import { ProdutosService } from '../services/produtos';

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
// Página de detalhe do produto: mostra informação, permite personalização
// e adiciona o item ao carrinho (gestão de ingredientes e contador).
export class DetalheMenuPage {

  produto: any;
  modalIngredientesAberto = false;
  ingredientesSelecionados: string[] = [];
  quantidadeCarrinho = 0;
  emailAtual: string | null = null;

  mostrarPopup = false;
  mensagemPopup = '';
  tipoPopup: 'sucesso' | 'erro' = 'sucesso';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private produtosService: ProdutosService
  ) {
    addIcons({
      cartOutline,
      arrowBackOutline
    });
  }

  // Inicializa o produto atual e actualiza o contador do carrinho.
  async ionViewWillEnter() {
    this.emailAtual = await this.storageService.get('utilizadorAtual');

    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.produtosService.getProdutos().subscribe(async (produtos: any[]) => {
      this.produto = produtos[id];

      if (this.produto) {
        this.ingredientesSelecionados = [
          ...this.produto.ingredientesPersonalizaveis
        ];
      }

      await this.atualizarQuantidadeCarrinho();
    });
  }

  voltar() {
    this.router.navigate(['/tabs/tab1']);
  }

  // Converte o rating (ex: 4.5) numa lista de estrelas para o template.
  gerarEstrelasArray(rating: number): string[] {
    const cheias = Math.floor(rating);
    const vazias = 5 - cheias;

    return [
      ...Array(cheias).fill('★'),
      ...Array(vazias).fill('☆')
    ];
  }

  // Abre modal para escolher/remover ingredientes personalizáveis.
  abrirModalIngredientes() {
    this.ingredientesSelecionados = [
      ...this.produto.ingredientesPersonalizaveis
    ];

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

  async adicionarAoCarrinhoPersonalizado() {
    this.modalIngredientesAberto = false;
    await this.adicionarAoCarrinho();
  }


  get ingredientesRemovidos() {
    if (!this.produto) {
      return [];
    }

    return this.produto.ingredientesPersonalizaveis.filter(
      (ingrediente: string) =>
        !this.ingredientesSelecionados.includes(ingrediente)
    );
  }

  // Adiciona o produto ao carrinho guardado no Storage.
  // Compara ingredientes removidos para juntar à mesma entrada se existir.
  async adicionarAoCarrinho() {
    this.emailAtual = await this.storageService.get('utilizadorAtual');

    if (!this.emailAtual) {
      this.abrirPopup('Tens de iniciar sessão primeiro.', 'erro');
      return;
    }

    const chaveCarrinho = `carrinho_${this.emailAtual}`;
    const carrinhoAtual = await this.storageService.get(chaveCarrinho) || [];

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

    await this.storageService.set(chaveCarrinho, carrinhoAtual);
    await this.atualizarQuantidadeCarrinho();

    window.dispatchEvent(new Event('carrinhoAtualizado'));

    this.abrirPopup('Produto adicionado ao carrinho.', 'sucesso');
  }

  // Atualiza o número total de itens no badge do carrinho.
  async atualizarQuantidadeCarrinho() {
    this.emailAtual = await this.storageService.get('utilizadorAtual');

    if (!this.emailAtual) {
      this.quantidadeCarrinho = 0;
      return;
    }

    const chaveCarrinho = `carrinho_${this.emailAtual}`;
    const carrinho = await this.storageService.get(chaveCarrinho) || [];

    this.quantidadeCarrinho = carrinho.reduce((total: number, item: any) => {
      return total + item.quantidade;
    }, 0);
  }

  abrirCarrinho() {
    this.router.navigate(['/carrinho']);
  }

  // Mostra um popup de feedback (sucesso/erro) ao utilizador.
  abrirPopup(mensagem: string, tipo: 'sucesso' | 'erro' = 'sucesso') {
    this.mensagemPopup = mensagem;
    this.tipoPopup = tipo;
    this.mostrarPopup = true;
  }

  // Fecha o popup; redireciona para login se a mensagem indicar necessidade.
  fecharPopup() {
    this.mostrarPopup = false;

    if (this.mensagemPopup === 'Tens de iniciar sessão primeiro.') {
      this.router.navigate(['/login']);
    }
  }
}