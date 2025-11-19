import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoriasRamComponent } from './memorias-ram.component';

describe('MemoriasRamComponent', () => {
  let component: MemoriasRamComponent;
  let fixture: ComponentFixture<MemoriasRamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemoriasRamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemoriasRamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
