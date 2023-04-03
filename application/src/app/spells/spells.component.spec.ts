import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpellsComponent } from './spells.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

describe('SpellsComponent', () => {
  let component: SpellsComponent;
  let fixture: ComponentFixture<SpellsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule, 
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        Ng2SearchPipeModule
        ],
      declarations: [ SpellsComponent ],
      providers: []
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpellsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('The /spells page renders', () => {
    expect(component).toBeTruthy();
  });

  describe('add', () => { 
    it('ADD button works', () => {
      component.add(12);
      expect(component.addSubmitted).toBeTruthy();
    });
  });

  describe('remove', () => {
    it('REMOVE button works', () => {
      component.remove(12);
      expect(component.removeSubmitted).toBeTruthy();
    });
  });
});
