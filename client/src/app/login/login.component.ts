import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service'
import { SharedDataService } from '../shared-data.service'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


//responsible for the login and creating account component
export class LoginComponent implements OnInit {
  response = '';              //displays the login response to the user
  loginTitle = "Sign in";     //login title changing
  createAccountButtonText = "Create account";   //button text changing
  creatingAccount = false;    //toggles create account/login
  
  constructor(private _loginService: LoginService, private _sharedData: SharedDataService) { }

  ngOnInit() {  }
  
  //used for UI opening and closing
  toggleSignIn(){
    if (this._sharedData.getSignInDisplayed() == true){
      this._sharedData.setSignInDisplayed(false)
    }
    else{
      this._sharedData.setSignInDisplayed(true)
    }
  }
  
  //used for UI opening and closing
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
  
  resetResponse(){ this.response = ''; }


  //validates an email with a common regex check
  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  //checks if the login form is filled out and then 
  //if in create account mode, submits the new account details using the login service
  //if in login account mode, submits the account details to be verified for login
  submitLoginForm(email, pass, name) {
    if (name == "" && this.creatingAccount){
      this.response = "Please enter a name.";
      return;
    }
    else if (email == "" || !this.validateEmail(email) && email != "root"){
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
  
  //call back from login/create account submit
  //if successful, sets the user data in the shared data service
  //notifies the user of success
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
