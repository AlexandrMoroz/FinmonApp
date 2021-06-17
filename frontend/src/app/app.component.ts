import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import {
  NbIconLibraries,
  NbMenuService,
  NbSidebarService,
} from '@nebular/theme';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'fron-end-app';
  flag: boolean = false;
  constructor(
    public authService: AuthService,
    private iconLibraries: NbIconLibraries,
    private nbService: NbSidebarService
  ) {
    this.iconLibraries.registerFontPack('font-awesome', {
      packClass: 'fas',
      iconClassPrefix: 'fa',
    });
    this.iconLibraries.setDefaultPack('font-awesome');
    
  }
  toggle() {
    this.flag = !this.flag;
    this.flag
      ? this.nbService.compact('menu-sidebar')
      : this.nbService.expand('menu-sidebar');
  }
}
