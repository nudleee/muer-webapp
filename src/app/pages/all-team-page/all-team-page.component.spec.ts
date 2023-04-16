import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTeamPageComponent } from './all-team-page.component';

describe('AllTeamPageComponent', () => {
  let component: AllTeamPageComponent;
  let fixture: ComponentFixture<AllTeamPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllTeamPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AllTeamPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
