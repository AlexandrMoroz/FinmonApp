import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { NbIconLibraries,NbSidebarService } from '@nebular/theme';

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
    private sidebarService: NbSidebarService,
    private iconLibraries: NbIconLibraries
  ) {
    this.iconLibraries.registerFontPack('font-awesome', {packClass:"fas", iconClassPrefix: 'fa' });
    this.iconLibraries.setDefaultPack('font-awesome');
  }
  toggle() {
    this.flag = !this.flag;
  }
}
