import { Component } from '@angular/core';
import { SharedDataService } from './shared-data.service'
import { LoginService } from './login.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
    constructor(private _sharedData: SharedDataService, private _loginService: LoginService) {  }
    
    ngOnInit(){
      // this._loginService.authenticateToken( this.authenticationResponse.bind(this));
    }
    
    authenticationResponse(success, data){
      if (success){
        this._sharedData.setEmail(data.email);
        this._sharedData.setUsername(data.name);
        this._sharedData.setSignInState(true);
      }
    }
}

