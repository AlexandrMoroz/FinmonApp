import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NbMenuItem, NbMenuService } from '@nebular/theme';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  @Output() sidebarToggle: EventEmitter<any> = new EventEmitter();
  userLinks: Array<NbMenuItem> = [
    {
      title: 'Фізична особи',
      link: '/people',
      icon: 'user-alt',
    },

    // {
    //   title: 'Фоп',
    //   link: '/people-fop',
    //   icon: 'person-outline',
    // },
    // {
    //   title: 'Компании резиденты',
    //   link: '/companies',
    //   icon: 'briefcase-outline',
    // },
    // {
    //   title: 'Компании не резиденты',
    //   link: '/companies-not-resident',
    //   icon: 'briefcase-outline',
    // },
    // {
    //   title: 'Представители не резидента',
    //   link: '/companies-representative',
    //   icon: 'briefcase-outline',
    // },
    {
      title: 'Згорнути',
      icon: 'arrow-left',
    },
  ];

  adminLinks: Array<NbMenuItem> = [
    {
      title: 'Головна',
      link: '/home',
      icon: 'home',
    },
    {
      title: 'Користувачі',
      link: '/users',
      icon: 'user-friends',
    },
    // {
    //   title: 'Настройки',
    //   link: '/settings',
    //   icon: 'settings-2-outline',
    // },
    {
      title: 'Історія',
      link: '/history',
      icon: 'history',
    },
  ];
  items: Array<NbMenuItem> = [];
  constructor(
    private router: Router,
    public authService: AuthService,
    private menuService: NbMenuService
  ) {
    this.authService.isAdmin ? this.items.push(...this.adminLinks):'';
    this.items.push(...this.userLinks);
  }

  ngOnInit(): void {
    this.menuService.onItemClick().subscribe((event) => {
      if (event.item.title === 'Згорнути') {
        this.sidebarToggle.emit();
      }
    });
  }
}
