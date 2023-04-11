import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContacUsPageComponent } from './contac-us-page.component';

describe('ContacUsPageComponent', () => {
  let component: ContacUsPageComponent;
  let fixture: ComponentFixture<ContacUsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContacUsPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContacUsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
