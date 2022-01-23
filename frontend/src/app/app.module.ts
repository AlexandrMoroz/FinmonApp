import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { PersonComponent } from './person/person.component';
import { UsersComponent } from './users/users.component';
import { CompanyComponent } from './company/company.component';

import { HistoryComponent } from './history/history.component';
import { SettingsComponent } from './settings/settings.component';
import { RepeatComponent } from './repeat/repeat.type';


import { FlashMessagesModule } from 'angular2-flash-messages';
import { AuthService } from './services/auth.service';

import { SearchPipe } from './pipes/serchfilter.pipe';
import { FilterFlagsPipe } from './pipes/filter-flags.pipe';
import { AuthGuard } from './guards/auth.guard';
import { ErrorInterceptor } from './error.interceptor';
import { JwtInterceptor } from './jwt.interceptor';

import {
  NbSidebarModule,
  NbLayoutModule,
  NbCardModule,
  NbButtonModule,
  NbThemeModule,
  NbMenuModule,
  NbListModule,
  NbTabsetModule,
  NbIconModule,
  NbInputModule,
  NbSpinnerModule,
  NbAutocompleteModule
} from '@nebular/theme';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { MatTabsModule } from '@angular/material/tabs';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { RepeatOneRowComponent } from './repeat-one-row/repeat-one-row.component';
import { TabsType } from './tabstype/tabs.component';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { ButtonType } from './buttontype/button.companent';
import { SearchComponent } from './search/search.component';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    MenuComponent,
    PersonComponent,
    UsersComponent,
    CompanyComponent,
    SettingsComponent,
    HistoryComponent,
    FilterFlagsPipe,
    SearchPipe,
    RepeatComponent,
    RepeatOneRowComponent,
    TabsType,
    AutocompleteComponent,
    ButtonType,
    SearchComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    FlashMessagesModule.forRoot(),
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NbSidebarModule.forRoot(),
    NbThemeModule.forRoot({name: 'dark'}),
    NbLayoutModule,
    NbIconModule,
    NbButtonModule,
    NbMenuModule.forRoot(),
    NbCardModule,
    NbListModule,
    Ng2SmartTableModule,
    NbInputModule,
    NbSpinnerModule,
    NbTabsetModule,
    NbAutocompleteModule,
    FormlyModule.forRoot({
      types: [
        {
          name: 'button',
          component: ButtonType,
        },
        {
          name: 'repeat',
          component: RepeatComponent,
        },{
          name: 'repeat-one-row',
          component:RepeatOneRowComponent,
        },{
          name:'tabs',
          component:TabsType,
        },{
          name:'autocomplete',
          component:AutocompleteComponent,
        },
      ],
      validationMessages: [
        { name: 'required', message: requireValidationMessage},
      ],
    }),
    FormlyBootstrapModule,
    MatTabsModule
  
  ],
  providers: [
    AuthService,
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
export function requireValidationMessage(err, field) {
  return `Поле ${field.templateOptions.label} обов'язкове`;
}