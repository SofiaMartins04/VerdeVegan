import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProdutosService {

  constructor(private http: HttpClient) {}

  getProdutos() {
    return this.http.get<any[]>('assets/data/produtos.json');
  }
}