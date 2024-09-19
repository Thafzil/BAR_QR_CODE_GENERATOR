import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  signup_val = false;
  constructor(
    private appsrv: AppService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}
  ngOnInit(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('user_name');
  }
  username: string = '';
  password: string = '';
  password_confirm: string = '';
  err_msg: string = '';
  name:string=''
  login() {
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (this.username !== '' && this.password !== '') {
      if (emailRegex.test(this.username)) {
        this.appsrv.loginSrv(this.username, this.password).subscribe({
          next: (res) => {
            localStorage.setItem('user', JSON.stringify(res['email']));
            localStorage.setItem('user_name',res['name'])
            this.openSnackBar('Logged in as ' + res['email'], 'Ok');
            this.appsrv.updateBadgeCount();
            this.router.navigate(['/home']);
          },
          error: (err) => {
            console.log(err);
            if (err.error['message'] === 'wrong_password_err') {
              this.err_msg = 'Entered wrong password for this user';
              this.openSnackBar(this.err_msg, 'Retry');
            } else if (err.error['message'] === 'email_not_found_err') {
              this.err_msg = 'Entered user is not found in our database';
              this.openSnackBar(this.err_msg, 'Retry');
            } else {
              this.openSnackBar('Something went wrong', 'Ok');
            }
          },
        });
      } else {
        this.openSnackBar('Invalid email format', 'Rertry');
      }
    } else if (this.username === '') {
      this.openSnackBar('Enter username for login', 'Ok');
    } else {
      this.openSnackBar('Enter Password for login', 'Ok');
    }
  }

  signup() {
    this.signup_val = true;
  }
  completeSignup() {
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      this.username !== '' &&
      this.password !== '' &&
      this.password_confirm !== '' &&
      this.name!==''
    ) {
      if (this.password === this.password_confirm) {
        if (emailRegex.test(this.username)) {
          this.appsrv
            .signup(this.name,this.username, this.password, this.password_confirm)
            .subscribe({
              next: (res) => {
                localStorage.setItem('user', JSON.stringify(res['email']));
                localStorage.setItem('user_name',res['name'])
                this.router.navigate(['/home']);
                this.openSnackBar(
                  'Automatically logged in as ' + res['email'],
                  'Ok'
                );
              },
              error: (err) => {
                console.log(err);
                this.openSnackBar(err.error['message'], 'Retry');
              },
            });
        } else {
          this.openSnackBar('Invalid email format', 'Rertry');
        }
      } else {
        this.openSnackBar('Password should match', 'Retry');
      }
    } else if (this.username === '') {
      this.openSnackBar('Username should not be empty', 'Retry');
    } else if(this.name === '') {
      this.openSnackBar('Full name should not be empty', 'Retry');
    }else{
      this.openSnackBar('Password should not be empty', 'Retry');
    }
  }

  try() {
    localStorage.setItem('user', 'user1@test.com');
    localStorage.setItem('user_name', 'Test User')
    this.appsrv.updateBadgeCount();
    this.router.navigate(['/home']);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }
}
