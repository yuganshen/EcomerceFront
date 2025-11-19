import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InicioAdminComponent } from './inicioadmin.component';

describe('InicioAdminComponent', () => {
  let component: InicioAdminComponent;
  let fixture: ComponentFixture<InicioAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioAdminComponent] // standalone component
    }).compileComponents();

    fixture = TestBed.createComponent(InicioAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debe crearse el componente', () => {
    expect(component).toBeTruthy();
  });
});
