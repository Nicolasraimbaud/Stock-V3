import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandeTicketComponent } from './commande-ticket.component';

describe('CommandeTicketComponent', () => {
  let component: CommandeTicketComponent;
  let fixture: ComponentFixture<CommandeTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandeTicketComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommandeTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
