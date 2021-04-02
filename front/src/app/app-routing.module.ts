import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PeopleComponent } from './people/people.component';
import { UsersComponent } from './users/users.component';
import { CompaniesComponent } from './companies/companies.component';
import { AuthGuard } from './guards/auth.guard';
import { Role } from './shared/models';
import { SettingsComponent } from './settings/settings.component';
import { HistoryComponent } from './history/history.component';

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
    path: 'companies',
    canActivate: [AuthGuard],
    component: CompaniesComponent,
  },
  {
    path: 'people',
    canActivate: [AuthGuard],
    component: PeopleComponent,
  },
  {
    path: '',
    redirectTo: 'people',
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
