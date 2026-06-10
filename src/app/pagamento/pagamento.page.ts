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
import { StorageService } from '../services/storage';

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

  // Dados de entrega (pré-preenchidos a partir do utilizador)
  nome = '';
  morada = '';
  codigoPostal = '';
  localidade = '';
  nif = '';

  // Dados do cartão (simulados — sem validação real de crédito)
  nomeCartao = '';
  numeroCartao = '';
  validade = '';
  cvv = '';

  // Estado da página
  carrinho: any[] = [];
  emailAtual: string | null = null;

  // Popup de feedback
  mostrarPopup = false;
  mensagemPopup = '';
  tipoPopup: 'sucesso' | 'erro' = 'sucesso';
  destinoDepoisPopup = '';

  // Flags de validação para cada campo
  erroNome = false;
  erroMorada = false;
  erroCodigoPostal = false;
  erroLocalidade = false;
  erroNif = false;
  erroNomeCartao = false;
  erroNumeroCartao = false;
  erroValidade = false;
  erroCvv = false;

  // Campos de data do cartão (mês e ano)
  mes = '';
  ano = '';

  // Listas de opções para os dropdowns
  meses = [
    '01','02','03','04','05','06',
    '07','08','09','10','11','12'
  ];

  anos = [
    '26','27','28','29','30',
    '31','32','33','34','35'
  ];

  constructor(
    private router: Router,
    private storageService: StorageService
  ) {
    addIcons({
      arrowBackOutline,
      cardOutline
    });
  }

  get chaveCarrinho() {
    return `carrinho_${this.emailAtual}`;
  }

  get chavePedidos() {
    return `pedidos_${this.emailAtual}`;
  }

  async ionViewWillEnter() {
    // Carrega utilizador, carrinho e pré-preenche nome/morada do formulário.
    this.emailAtual = await this.storageService.get('utilizadorAtual');

    if (!this.emailAtual) {
      this.router.navigate(['/login']);
      return;
    }

    this.carrinho = await this.storageService.get(this.chaveCarrinho) || [];

    const utilizadores = await this.storageService.get('utilizadores') || [];

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

  // Valida dados do formulário e processa o pagamento (simulado).
  // Regista o pedido, actualiza pontos e limpa o carrinho.
  async finalizarPagamento() {
    // Expressos regulares para validação
    const regexCodigoPostal = /^\d{4}-\d{3}$/;  
    const regexSoLetras = /^[A-Za-zÀ-ÿ\s]+$/;   
    const regexNif = /^\d{9}$/;                 
    const regexNumeroCartao = /^\d{16}$/;       
    const regexCvv = /^\d{3}$/;                 

    // Validação de cada campo de entrega
    this.erroNome = !this.nome.trim();
    this.erroMorada = !this.morada.trim();
    this.erroCodigoPostal = !regexCodigoPostal.test(this.codigoPostal.trim());
    this.erroLocalidade = !regexSoLetras.test(this.localidade.trim());
    // NIF é opcional — valida só se preenchido
    this.erroNif = this.nif.trim() !== '' && !regexNif.test(this.nif.trim());

    // Validação dos dados do cartão
    this.erroNomeCartao = !regexSoLetras.test(this.nomeCartao.trim());
    this.erroNumeroCartao = !regexNumeroCartao.test(this.numeroCartao.trim());
    this.erroValidade = !this.mes || !this.ano;
    this.erroCvv = !regexCvv.test(this.cvv.trim());

    if (
      this.erroNome ||
      this.erroMorada ||
      this.erroCodigoPostal ||
      this.erroLocalidade ||
      this.erroNif ||
      this.erroNomeCartao ||
      this.erroNumeroCartao ||
      this.erroValidade ||
      this.erroCvv
    ) {
      return;
    }

    if (this.carrinho.length === 0) {
      this.abrirPopup('O carrinho está vazio.', 'erro');
      this.router.navigate(['/tabs/tab1']);
      return;
    }

    const pontosGanhos = this.carrinho.reduce((total, item) => {
      return total + (item.pontos * item.quantidade);
    }, 0);

    const chavePontos = `pontos_${this.emailAtual}`;
    const pontosAtuais = Number(await this.storageService.get(chavePontos) || 0);

    await this.storageService.set(
      chavePontos,
      pontosAtuais + pontosGanhos
    );

    this.validade = `${this.mes}/${this.ano}`;

    const pedidos = await this.storageService.get(this.chavePedidos) || [];

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
      total: this.total,
      pontosGanhos: pontosGanhos
    };

    pedidos.push(novoPedido);

    await this.storageService.set(this.chavePedidos, pedidos);

    await this.storageService.remove(this.chaveCarrinho);

    window.dispatchEvent(new Event('carrinhoAtualizado'));

    this.abrirPopup(`Encomenda realizada com sucesso! Ganhaste ${pontosGanhos} pontos.`,'sucesso','/tabs/tab2');
  }

  abrirPopup(
    mensagem: string,
    tipo: 'sucesso' | 'erro' = 'sucesso',
    destino: string = ''
  ) {
    this.mensagemPopup = mensagem;
    this.tipoPopup = tipo;
    this.destinoDepoisPopup = destino;
    this.mostrarPopup = true;
  }

  fecharPopup() {
    this.mostrarPopup = false;

    if (this.destinoDepoisPopup) {
      this.router.navigate([this.destinoDepoisPopup]);
      this.destinoDepoisPopup = '';
    }
  }
}