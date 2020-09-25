import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  NbCardModule,
} from '@nebular/theme';
import { AuthRoutingModule } from './auth-routing.module';

import { LoginComponent } from './login/login.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AuthRoutingModule,
    NbCardModule,
    ReactiveFormsModule
  ],
  declarations: [
    LoginComponent
  ],
})
export class AuthModule {
}