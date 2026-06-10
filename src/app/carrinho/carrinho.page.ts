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
// Página do carrinho: controla os itens do carrinho e o uso de recompensas.
export class CarrinhoPage {
  // Estado principal da página
  carrinho: any[] = [];
  recompensasDisponiveis: any[] = [];
  emailAtual: string | null = null;

  modalRecompensaAberto = false;
  recompensaSelecionada: any = null;
  opcoesRecompensa: any[] = [];
  mostrarPopup = false;
  mensagemPopup = '';
  tipoPopup: 'sucesso' | 'erro' = 'sucesso';
  modalRemoverAberto = false;
  indexParaRemover: number | null = null;
  tipoConfirmacao: 'produto' | 'recompensa' | 'carrinho' = 'produto';

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

  // Inicializa o estado quando a página do carrinho aparece.
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

  // Calcula o total do carrinho com base no preço e quantidade.
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

  // Prepara a seleção de produto gratuito para a recompensa escolhida.
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

  // Adiciona ao carrinho o produto selecionado como recompensa.
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

  // Cancela uma recompensa e devolve os pontos ao utilizador.
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

  abrirConfirmacaoRemover(index: number) {
    this.indexParaRemover = index;
    this.tipoConfirmacao = 'produto';
    this.modalRemoverAberto = true;
  }

  abrirConfirmacaoRecompensa(index: number) {
    this.indexParaRemover = index;
    this.tipoConfirmacao = 'recompensa';
    this.modalRemoverAberto = true;
  }

  abrirConfirmacaoLimparCarrinho() {
    this.tipoConfirmacao = 'carrinho';
    this.modalRemoverAberto = true;
  }

  fecharConfirmacaoRemover() {
    this.indexParaRemover = null;
    this.modalRemoverAberto = false;
  }

  // Confirma remoção de item, recompensa ou limpeza do carrinho.
  async confirmarAcao() {

    if (this.tipoConfirmacao === 'produto') {
      if (this.indexParaRemover !== null) {
        this.carrinho.splice(this.indexParaRemover, 1);
        await this.guardarCarrinho();
      }

      this.fecharConfirmacaoRemover();
      this.abrirPopup('Produto removido do carrinho.', 'sucesso');
      return;
    }

    if (this.tipoConfirmacao === 'recompensa') {
      if (this.indexParaRemover !== null) {
        await this.cancelarRecompensa(this.indexParaRemover);
      }

      this.fecharConfirmacaoRemover();
      return;
    }
    
    if (this.tipoConfirmacao === 'carrinho') {
      await this.limparCarrinho();

      this.fecharConfirmacaoRemover();
      this.abrirPopup('Carrinho limpo com sucesso.', 'sucesso');
      return;
    }
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
      this.abrirConfirmacaoRecompensa(index);
      return;
    }

    if (this.carrinho[index].quantidade > 1) {
      this.carrinho[index].quantidade--;
    } else {
      this.abrirConfirmacaoRemover(index);
      return;
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