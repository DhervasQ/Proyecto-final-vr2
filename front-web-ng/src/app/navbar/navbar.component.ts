import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isLoggedIn: boolean;

  constructor() {
    this.isLoggedIn = localStorage.getItem('token') !== null;
  }
}
