import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatatableGenericComponent } from './datatable-generic.component';

describe('DatatableGenericComponent', () => {
  let component: DatatableGenericComponent;
  let fixture: ComponentFixture<DatatableGenericComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatatableGenericComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatatableGenericComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
