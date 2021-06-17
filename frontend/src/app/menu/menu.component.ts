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
      link: '/person',
      icon: 'user-alt',
    },
    {
      title: 'Компанії',
      link: '/company',
      icon: 'suitcase',
    },
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
      {
      title: 'Історія',
      link: '/history',
      icon: 'history',
    },
  ];
  items: Array<NbMenuItem> = [];
  constructor(
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
