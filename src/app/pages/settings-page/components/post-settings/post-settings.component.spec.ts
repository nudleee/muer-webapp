import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostSettingsComponent } from './post-settings.component';

describe('PostSettingsComponent', () => {
  let component: PostSettingsComponent;
  let fixture: ComponentFixture<PostSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
