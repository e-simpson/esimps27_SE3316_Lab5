import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

//main app
import { AppComponent } from './app.component';

//services
import { LoginService } from './login.service';
import { SharedDataService } from './shared-data.service';
import { CollectionService } from './collection.service';

//components
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { AppbarComponent } from './appbar/appbar.component';
import { ImagesComponent } from './images/images.component';
import { CollectionCreatorComponent } from './collection-creator/collection-creator.component';
import { RatebarComponent } from './ratebar/ratebar.component';

//third party
// import { StarRatingModule } from 'angular-star-rating';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    WelcomeComponent,
    AppbarComponent,
    ImagesComponent,
    CollectionCreatorComponent,
    RatebarComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    // StarRatingModule.forRoot()
  ],
  providers: [
    LoginService, 
    SharedDataService,
    CollectionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }