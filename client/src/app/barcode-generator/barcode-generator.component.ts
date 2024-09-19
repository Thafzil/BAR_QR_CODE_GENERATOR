import { Component } from '@angular/core';
import { AppService } from '../app.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-barcode-generator',
  templateUrl: './barcode-generator.component.html',
  styleUrls: ['./barcode-generator.component.scss'],
})
export class BarcodeGeneratorComponent {
  img_bars:string[]=[];
  isText = 'text';
  textVal!: string;
  fileName!: string;
  textVals:string[];
  imgs_blob:any[]=[];
  file: File;

  constructor(private appsrv: AppService, private _snackBar: MatSnackBar) {}
  ngOnInit(): void {
    let a = 'Thafzil';
    // this.generateBar(a)
  }
  generateBar() {
    this.img_bars=[]
    this.imgs_blob=[]
    if (this.isText === 'text') {
      this.appsrv.generateBarcode(this.textVal).subscribe({
        next: (res: Blob) => {
        this.imgs_blob.push({'name':this.textVal, 'type':'bar'})
        this.img_bars.push(URL.createObjectURL(res));
      }, 
      error: err=>this.openSnackBar('Enter a valid text','Ok')});
    } else if(this.isText==='csv') {
      this.appsrv.generateBarcodes(this.file).subscribe((images:any) => {
        this.img_bars=images.map((res:{name:string,image:any})=>{
          this.imgs_blob.push({'name':res.name, 'type':'bar'})
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
      // this.appsrv.uploadFileAndGenerateBarCode(file);
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
    this.img_bars=[]
    this.textVal=''
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action,{
      duration: 3000
    });
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
}
