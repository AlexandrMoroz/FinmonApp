import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { NbSidebarService } from '@nebular/theme';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'fron-end-app';
  flag: boolean = true;
  constructor(
    public authService: AuthService,
    private sidebarService: NbSidebarService
  ) {}
  toggle() {
    this.flag = !this.flag;
    console.log(this.flag);
  }
}
