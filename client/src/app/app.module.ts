import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';

import { LoginService } from './login.service';
import { SharedDataService } from './shared-data.service';

import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { AppbarComponent } from './appbar/appbar.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    WelcomeComponent,
    AppbarComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
  ],
  providers: [
    LoginService, 
    SharedDataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }