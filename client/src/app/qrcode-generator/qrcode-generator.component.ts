import { Component } from '@angular/core';
import { AppService } from '../app.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-qrcode-generator',
  templateUrl: './qrcode-generator.component.html',
  styleUrls: ['./qrcode-generator.component.scss']
})
export class QrcodeGeneratorComponent {
  imgs_blob: any[]=[];
  constructor(private appsrv:AppService, private _snackBar: MatSnackBar){}


  img_QRs:string[]=[];
  isText = 'text';
  textVal!: string;
  fileName!: string;
  file: File;

  generateQR() {
    this.img_QRs=[]
    this.imgs_blob=[]
    if (this.isText === 'text') {
      this.appsrv.generateQRcode(this.textVal).subscribe({
        next: (res: Blob) => {
        this.imgs_blob.push({'name':this.textVal,'type':'qr'})
        this.img_QRs.push(URL.createObjectURL(res));
      }, 
      error: err=>this.openSnackBar('Enter a valid text','Ok')});
    } else if(this.isText==='csv') {
      this.appsrv.generateQRcodes(this.file).subscribe((images:any) => {
        this.img_QRs=images.map((res:{name:string,image:any})=>{
          this.imgs_blob.push({'name':res.name,'type':'qr'})
          return {
            name:res.name,
            image:this.createImageURL(res.image)
          }
        })
      },err=>this.openSnackBar('Enter a valid csv file','Ok'));
    }
  }
  createImageURL(image: string): string {
    const binaryData = atob(image);
    const byteNumbers = new Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      byteNumbers[i] = binaryData.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' });
    return URL.createObjectURL(blob);
  }


  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.file = file;
    if (file && file.type === 'text/csv') {
      // File is a CSV file, do something with it
      // this.appsrv.uploadFileAndGenerateQRCode(file);
    } else {
      // File is not a CSV file, show an error message
      this.openSnackBar(
        'File is not a CSV file',
        'Retry by uploading CSV file'
      );
      console.log('File is not a CSV file');
    }
  }

  resetForm(){
    this.img_QRs=[]
    this.textVal=''
  }

  handledbClick(){
    this.appsrv.saveToDB(this.imgs_blob).subscribe({
      next:(res)=>{
      this.appsrv.updateBadgeCount()
      this.openSnackBar(res['message'], 'Ok')
    },
      error:(err)=>{
        this.openSnackBar('Error in uploading the image','Ok')
      }
  })
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action,{
      duration: 3000
    });
  }
}
