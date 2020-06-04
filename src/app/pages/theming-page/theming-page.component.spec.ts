import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemingPageComponent } from './theming-page.component';

describe('ThemingPageComponent', () => {
  let component: ThemingPageComponent;
  let fixture: ComponentFixture<ThemingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThemingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
