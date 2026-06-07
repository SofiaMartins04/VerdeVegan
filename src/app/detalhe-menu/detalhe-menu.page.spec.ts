import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalheMenuPage } from './detalhe-menu.page';

describe('DetalheMenuPage', () => {
  let component: DetalheMenuPage;
  let fixture: ComponentFixture<DetalheMenuPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalheMenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
