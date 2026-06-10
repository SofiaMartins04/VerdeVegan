import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
// Serviço de Storage: encapsula a biblioteca @ionic/storage-angular para
// persistência de dados locais (utilizadores, carrinho, pedidos, pontos, etc.)
export class StorageService {
  // Referência ao Storage preparado/inicializado
  private storagePronto: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  // Inicializa o Storage da app (é executado no construtor)
  async init() {
    this.storagePronto = await this.storage.create();
  }

  // Grava um par chave-valor no Storage
  async set(chave: string, valor: any) {
    await this.storagePronto?.set(chave, valor);
  }

  // Recupera um valor pelo nome da chave
  async get(chave: string) {
    return await this.storagePronto?.get(chave);
  }

  // Remove um item do Storage
  async remove(chave: string) {
    await this.storagePronto?.remove(chave);
  }

  // Limpa todo o Storage (usado no logout ou reset)
  async clear() {
    await this.storagePronto?.clear();
  }
}