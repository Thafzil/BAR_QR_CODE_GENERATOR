import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrcodeDecoderComponent } from './qrcode-decoder.component';

describe('QrcodeDecoderComponent', () => {
  let component: QrcodeDecoderComponent;
  let fixture: ComponentFixture<QrcodeDecoderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrcodeDecoderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrcodeDecoderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
