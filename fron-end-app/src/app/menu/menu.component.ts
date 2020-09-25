import { Component, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  userLinks: Array<NbMenuItem> = [
    {
      title: 'Физлица',
      link: '/people',
      icon: 'person-outline',
    },
    {
      title: 'Фоп',
      link: '/people-fop',
      icon: 'person-outline',
    },
    {
      title: 'Компании резиденты',
      link: '/companies',
      icon: 'briefcase-outline',
    },
    {
      title: 'Компании не резиденты',
      link: '/companies-not-resident',
      icon: 'briefcase-outline',
    },
    {
      title: 'Представители не резидента',
      link: '/companies-representative',
      icon: 'briefcase-outline',
    },
  ];

  adminLinks: Array<NbMenuItem> = [
    {
      title: 'Главная',
      link: '/home',
      icon: 'home',
    },
    {
      title: 'Пользователи',
      link: '/users',
      icon: 'people-outline',
    },
    {
      title: 'Настройки',
      link: '/settings',
      icon: 'settings-2-outline',
    },
    {
      title: 'История',
      link: '/history',
      icon: 'archive-outline',
    },
  ];
  items: Array<NbMenuItem> = [];
  constructor(private router: Router, public authService: AuthService) {
    if (!this.authService.isAdmin) {
      this.items =  this.userLinks;
    } else {
      this.items = [...this.adminLinks, ...this.userLinks];
    }
  }

  ngOnInit(): void {
   
  }
}
