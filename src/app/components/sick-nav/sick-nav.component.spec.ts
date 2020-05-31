import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SickNavComponent } from './sick-nav.component';

describe('SickNavComponent', () => {
  let component: SickNavComponent;
  let fixture: ComponentFixture<SickNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SickNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SickNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
