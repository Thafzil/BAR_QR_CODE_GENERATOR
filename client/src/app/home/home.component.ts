import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  getName(){
    return localStorage.getItem('user_name')?localStorage.getItem('user_name'):'User'
  }
}
