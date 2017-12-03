import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../shared-data.service'

@Component({
  selector: 'app-appbar',
  templateUrl: './appbar.component.html',
  styleUrls: ['./appbar.component.css']
})

export class AppbarComponent implements OnInit {
  signinStatus = "Sign in"
  
  constructor(private _sharedData: SharedDataService) {
    // if (this._sharedData.getSignInDisplayed() == true){
    //   this.signinStatus = "Hide sign in";
    // }
    // else{
    //   this.signinStatus = "Sign in";
    // }
  }

  toggleSignIn(){
    if (this._sharedData.getSignInDisplayed() == true){
      // this.signinStatus = "Sign in"
      this._sharedData.setSignInDisplayed(false)
    }
    else{
      // this.signinStatus = "Hide sign in"
      this._sharedData.setSignInDisplayed(true)
    }
  }
  
  toggleSignInState(){
    if (this._sharedData.getSignInState() == true){
      this._sharedData.setSignInState(false);
      this._sharedData.setSignInDisplayed(false);
      this._sharedData.username = "Guest";
    }
    else{
      this._sharedData.setSignInState(true);
    }
  }

  ngOnInit() {
  }

}
