import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionUsuariosComponent } from './gestionusuarios.component';

describe('GestionUsuariosComponent', () => {
  let component: GestionUsuariosComponent;
  let fixture: ComponentFixture<GestionUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionUsuariosComponent] // standalone
    }).compileComponents();

    fixture = TestBed.createComponent(GestionUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debe crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('Debe alternar el estado del usuario', () => {
    const user = component.users[0];
    const originalState = user.active;

    component.toggleUser(user.id);

    expect(user.active).toBe(!originalState);
  });
});
