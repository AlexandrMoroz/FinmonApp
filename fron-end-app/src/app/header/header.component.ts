import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { routes } from '../auth/auth-routing.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(private router: Router, public authService: AuthService) {}

  ngOnInit(): void {}
  logout() {
    this.authService.logout();
    console.log('user is log out');
    this.router.navigate(['auth/login']);
  }
  login() {
    console.log('user is login');
  }
}
