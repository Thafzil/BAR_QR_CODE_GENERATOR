import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppService } from '../app.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-saved-dialog-box',
  templateUrl: './saved-dialog-box.component.html',
  styleUrls: ['./saved-dialog-box.component.scss']
})
export class SavedDialogBoxComponent implements OnInit{

  isText='csv'
  imgs=[]
  constructor( private appSrv:AppService, public _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<SavedDialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}
  ngOnInit(): void {
    this.imgs=this.data.map((res:{name:string,image:any, type:any})=>{
      return {
        name:res.name,
        image:this.createImageURL(res.image),
        type: res.type
      }
    })
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

  onNoClick(): void {
    this.dialogRef.close();
  }

  handledbClick(event){
    this.appSrv.deleteFromDB(event.name,event.type).subscribe({
      next:(res)=>{
      this.appSrv.updateBadgeCount()
      this.onNoClick()
      this.openSnackBar(res['message'], 'Ok')
    },
      error:(err)=>{
        this.openSnackBar('Error in deleting the image','Ok')
      }
  })
  }

  deleteAll(){
    this.appSrv.deleteAllFromDB().subscribe({
      next:(res)=>{
        this.appSrv.updateBadgeCount()
        this.onNoClick()
        this.openSnackBar(res['message'], 'Ok')
      },
      error:(err)=>{
        this.openSnackBar('Error in deleting image/s','Ok')
      }
    })
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

}
