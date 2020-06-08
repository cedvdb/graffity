import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeedDialogComponent } from './seed-dialog.component';

describe('SeedDialogComponent', () => {
  let component: SeedDialogComponent;
  let fixture: ComponentFixture<SeedDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeedDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
