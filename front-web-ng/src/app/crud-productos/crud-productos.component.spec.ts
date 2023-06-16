import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudProductosComponent } from './crud-productos.component';

describe('CrudProductosComponent', () => {
  let component: CrudProductosComponent;
  let fixture: ComponentFixture<CrudProductosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrudProductosComponent]
    });
    fixture = TestBed.createComponent(CrudProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
