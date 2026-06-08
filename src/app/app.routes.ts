import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'intro',
    pathMatch: 'full',
  },
  {
    path: 'intro',
    loadComponent: () => import('./intro/intro.page').then(m => m.IntroPage),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage),
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then(m => m.routes),
  },
  {
    path: 'registar',
    loadComponent: () => import('./registar/registar.page').then( m => m.RegistarPage)
  },
  {
    path: 'tab4',
    loadComponent: () => import('./tab4/tab4.page').then( m => m.Tab4Page)
  },
  {
    path: 'detalhe-menu/:id',
    loadComponent: () => import('./detalhe-menu/detalhe-menu.page').then( m => m.DetalheMenuPage)
  },
  {
    path: 'carrinho',
    loadComponent: () => import('./carrinho/carrinho.page').then( m => m.CarrinhoPage)
  },
  {
    path: 'pagamento',
    loadComponent: () => import('./pagamento/pagamento.page').then( m => m.PagamentoPage)
  },
];