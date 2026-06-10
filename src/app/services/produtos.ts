import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
// Serviço de Produtos: fornece a lista de pratos disponibilizados a partir
// de um ficheiro JSON estático (assets/data/produtos.json)
export class ProdutosService {

  constructor(private http: HttpClient) {}

  // Lê e retorna a lista de produtos do ficheiro JSON
  getProdutos() {
    return this.http.get<any[]>('assets/data/produtos.json');
  }
}