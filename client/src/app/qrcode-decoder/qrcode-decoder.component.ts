import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppService } from '../app.service';

@Component({
  selector: 'app-qrcode-decoder',
  templateUrl: './qrcode-decoder.component.html',
  styleUrls: ['./qrcode-decoder.component.scss']
})
export class QrcodeDecoderComponent {
  // imageBase64: string;
  decoded_string = '';
  constructor(private appSrv: AppService, private _snackBar: MatSnackBar) {}

  file: File;

  onProcessButtonClick() {

    this.appSrv.decodeQrcode(this.file).subscribe({
      next: (res: any) => {
        this.decoded_string=res['decoded']
        if(this.decoded_string===''){
          this.openSnackBar('It seems there is no QR code in the given image', 'Ok')
        }
      },
      error: (err: any) => this.openSnackBar('Enter a valid image file', 'Ok'),
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.file = file;
    if (file) {
      // File is a CSV file, do something with it
      // this.appsrv.uploadFileAndGenerateQRCode(file);
    } else {
      // File is not a CSV file, show an error message
      this.openSnackBar(
        'File is not an Image file',
        'Retry by uploading an Image file'
      );
      console.log('File is not an Image file');
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

  gotosite(str){
    if(str.indexOf(':')!==-1)
    window.open(str, '_blank');
  }
}
