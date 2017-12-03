import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service'
import { SharedDataService } from '../shared-data.service'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  response = '';
  loginTitle = "Sign in";
  createAccountButtonText = "Create account";
  creatingAccount = false;
  
  constructor(private _loginService: LoginService, private _sharedData: SharedDataService) { }

  ngOnInit() {
  }
  
  toggleSignIn(){
    if (this._sharedData.getSignInDisplayed() == true){
      this._sharedData.setSignInDisplayed(false)
    }
    else{
      this._sharedData.setSignInDisplayed(true)
    }
  }
  
  toggleCreateAccount(){
    if (this.creatingAccount == true){
      this.loginTitle = "Sign in"
      this.createAccountButtonText = "Create account"
      this.creatingAccount = false
    }
    else {
      this.loginTitle = "Create an account"
      this.createAccountButtonText = "Cancel create account"
      this.creatingAccount = true
    }
  }
  
  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  submitLoginForm(email, pass, name) {
    if (name == "" && this.creatingAccount){
      this.response = "Please enter a name.";
      return;
    }
    else if (email == "" || !this.validateEmail(email)){
      this.response = "Please enter a valid email.";
      return;
    }
    else if (pass == ""){
      this.response = "Please enter a password.";
      return;
    }
    
    if (this.creatingAccount == false){
        this._loginService.postLogin(email, pass, this.onResponse.bind(this));
    }
    else if (this.creatingAccount == true) {
        this._loginService.postCreateAccount(email, pass, name, this.onResponse.bind(this));
    }
  }
  
  resetResponse(){
    this.response = '';
  }
  
  onResponse(res, email) { 
    this.response = res.message;
    if (res.function == "login" && res.code == 200){
      this._sharedData.setSignInState(true);
      this._sharedData.setUsername(email);
      this._sharedData.setEmail(email);
      localStorage.setItem('token', res.token);
      window.location.reload();
    }
    if (res.function == "newAccount" && res.code == 200){
      this.toggleCreateAccount();
    }
  }
}
