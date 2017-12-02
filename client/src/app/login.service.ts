import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class LoginService {

    constructor(private http: HttpClient) { }
    
    postLogin(passedEmail, passedPass, callback_fun) {
      this.http.post('/api/login', {email: passedEmail, password: passedPass}).subscribe(data => {
          callback_fun(data['message']);
      });
    }
    
    postCreateAccount(passedEmail, passedPass, callback_fun) {
      this.http.post('/api/user', {email: passedEmail, password: passedPass}).subscribe(data => {
          callback_fun(data['message']);
      });
    }
}
