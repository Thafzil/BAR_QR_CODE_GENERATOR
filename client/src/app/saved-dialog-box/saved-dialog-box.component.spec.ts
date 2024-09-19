import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedDialogBoxComponent } from './saved-dialog-box.component';

describe('SavedDialogBoxComponent', () => {
  let component: SavedDialogBoxComponent;
  let fixture: ComponentFixture<SavedDialogBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavedDialogBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavedDialogBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
