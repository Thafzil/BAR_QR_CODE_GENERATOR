import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
import { SavedDialogBoxComponent } from '../saved-dialog-box/saved-dialog-box.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
  constructor(public dialog: MatDialog, private router:Router, private appSrv:AppService){}
  dbCount=0
  ngOnInit(): void {
      this.appSrv.updateBadgeCount()
      this.appSrv.currentBadgeCount.subscribe(count => {
      this.dbCount = count;
    });
    
  }
  sendEmail() {
    const recipient = "sarda2t@cmich.edu";
    const subject = "Awesome site!!";
    const email = "mailto:" + recipient + "?subject=" + encodeURIComponent(subject);
    window.open(email, '_blank');
  }
  logout(){
    localStorage.removeItem('user')
    localStorage.removeItem('user_name')
    this.router.navigate(['/login'])
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogBoxComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result==='True'){
        console.log('Logged out successfully');
        this.logout()
      }
    });
  }

  openDialog2(){
    this.appSrv.getFromDB().subscribe({
      next:(res)=>{
        const dialogRef = this.dialog.open(SavedDialogBoxComponent, {
            data:res
        });
      }
    })

  }
  sharePage(){
    const url = window.location.href;
    const title = document.title;
    window.open('mailto:?subject=' + title + '&body=' + url);
  }

  checkLogout(){
    return localStorage.getItem('user') && localStorage.getItem('user_name')
  }
}
