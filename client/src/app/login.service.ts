import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class LoginService {

    constructor(private http: HttpClient) { }
    
    authenticateToken(callback){
      var foundToken = localStorage.getItem('token');
      if (!foundToken) {callback(false); return;}
      this.http.post('/api/auth', {token: foundToken}).subscribe(data => {
        callback(true, data);
      });
    }
    
    postLogin(passedEmail, passedPass, callback_fun) {
      this.http.post('/api/login', {email: passedEmail, password: passedPass}).subscribe(data => {
          callback_fun(data, passedEmail);
      });
    }
    
    postCreateAccount(passedEmail, passedPass, passedName, callback_fun) {
      this.http.post('/api/user', {email: passedEmail, password: passedPass, name: passedName}).subscribe(data => {
          callback_fun(data, passedEmail);
      });
    }
}
