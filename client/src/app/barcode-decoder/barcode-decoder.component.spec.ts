import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarcodeDecoderComponent } from './barcode-decoder.component';

describe('BarcodeDecoderComponent', () => {
  let component: BarcodeDecoderComponent;
  let fixture: ComponentFixture<BarcodeDecoderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarcodeDecoderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarcodeDecoderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
