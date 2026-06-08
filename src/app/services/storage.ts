import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storagePronto: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    this.storagePronto = await this.storage.create();
  }

  async set(chave: string, valor: any) {
    await this.storagePronto?.set(chave, valor);
  }

  async get(chave: string) {
    return await this.storagePronto?.get(chave);
  }

  async remove(chave: string) {
    await this.storagePronto?.remove(chave);
  }

  async clear() {
    await this.storagePronto?.clear();
  }
}