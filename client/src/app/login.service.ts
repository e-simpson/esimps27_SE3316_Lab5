import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class LoginService {

    constructor(private http: HttpClient) { }
    
    authenticateToken(callback_fun){
      var foundToken = localStorage.getItem('token');
      if (!foundToken) {callback_fun(); return;}
      this.http.post('/api/auth', {token: foundToken}).subscribe(data => {
        callback_fun(data);
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
    
    
    
    
    postNewPolicy(newSecurity, newPrivacy, callback_fun) {
      this.http.post('/api/policy', {security: newSecurity, privacy: newPrivacy}).subscribe(data => {
          callback_fun(data);
      });
    }
    getPolicies(callback_fun) {
      this.http.get('/api/policy').subscribe(data => {
          callback_fun(data);
      });
    }
    
    postNewDMCA(newDmca, newTakedown, callback_fun) {
      this.http.post('/api/dmca', {dmca: newDmca, takedown: newTakedown}).subscribe(data => {
          callback_fun(data);
      });
    }
    getDMCA(callback_fun) {
      this.http.get('/api/dmca').subscribe(data => {
          callback_fun(data);
      });
    }
}
