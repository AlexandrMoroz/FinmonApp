import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PersonComponent } from './person/person.component';
import { UsersComponent } from './users/users.component';
import { CompanyComponent } from './company/company.component';
import { AuthGuard } from './guards/auth.guard';
import { Role } from './shared/models';
import { SettingsComponent } from './settings/settings.component';
import { HistoryComponent } from './history/history.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  {
    path: 'home',
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin] },
    component: HomeComponent,
  },
  {
    path: 'users',
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin] },
    component: UsersComponent,
  },
  {
    path:'settings',
    canActivate:[AuthGuard],
    data:{roles:[Role.Admin]},
    component: SettingsComponent,
  },
  {
    path:'history',
    canActivate:[AuthGuard],
    data:{roles:[Role.Admin]},
    component: HistoryComponent,
  },
  {
    path: 'company',
    canActivate: [AuthGuard],
    component: CompanyComponent,
  },
  {
    path: 'person',
    canActivate: [AuthGuard],
    component: PersonComponent,
  },
  {
    path: 'search',
    canActivate: [AuthGuard],
    component: SearchComponent,
  },
  {
    path: '',
    canActivate: [AuthGuard],
    redirectTo: 'person',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
