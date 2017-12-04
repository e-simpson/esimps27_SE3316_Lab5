import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

//main app
import { AppComponent } from './app.component';

//services
import { LoginService } from './login.service';
import { SharedDataService } from './shared-data.service';
import { CollectionService } from './collection.service';
import { SearchService } from './search.service';


//components
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { AppbarComponent } from './appbar/appbar.component';
import { ImagesComponent } from './images/images.component';
import { CollectionCreatorComponent } from './collection-creator/collection-creator.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    WelcomeComponent,
    AppbarComponent,
    ImagesComponent,
    CollectionCreatorComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    LoginService, 
    SharedDataService,
    CollectionService,
    SearchService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }