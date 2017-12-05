import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


//service responsible for connecting to the server
//can post a login query, post an account creation, post new policies, post a local token for authentication, post a filed report
//get policies on the server, get dmca from server, get all reports on server
//delete all filed reports


@Injectable()
export class LoginService {

    constructor(private http: HttpClient) { }
    
    
    //sends a locally stored token for authentication, with callback
    authenticateToken(callback_fun){
      var foundToken = localStorage.getItem('token');
      if (!foundToken) {callback_fun(); return;}
      this.http.post('/api/auth', {token: foundToken}).subscribe(data => {
        callback_fun(data);
      });
    }
    
    //sends inputted login details to be checked, with callback
    postLogin(passedEmail, passedPass, callback_fun) {
      this.http.post('/api/login', {email: passedEmail, password: passedPass}).subscribe(data => {
          callback_fun(data, passedEmail);
      });
    }
    
    //sends new account details details to be saved, with callback
    postCreateAccount(passedEmail, passedPass, passedName, callback_fun) {
      this.http.post('/api/user', {email: passedEmail, password: passedPass, name: passedName}).subscribe(data => {
          callback_fun(data, passedEmail);
      });
    }
    
    
    
    //posts updated policy to the server
    postNewPolicy(newSecurity, newPrivacy, callback_fun) {
      this.http.post('/api/policy', {security: newSecurity, privacy: newPrivacy}).subscribe(data => {
          callback_fun(data);
      });
    }
    //get all policies from server
    getPolicies(callback_fun) {
      this.http.get('/api/policy').subscribe(data => {
          callback_fun(data);
      });
    }
    
    //post new dmca to server
    postNewDMCA(newDmca, newTakedown, callback_fun) {
      this.http.post('/api/dmca', {dmca: newDmca, takedown: newTakedown}).subscribe(data => {
          callback_fun(data);
      });
    }
    //get all dmca policy from server
    getDMCA(callback_fun) {
      this.http.get('/api/dmca').subscribe(data => {
          callback_fun(data);
      });
    }
    
    
    //posts a flag on a collection to the server
    postFlag(passedid, passedemail, callback_fun){
      this.http.post('/api/report', {type: "takedown", id: passedid, flagged: true, desc: "clicked flag button", email: passedemail}).subscribe(data => {
          callback_fun(data);
      });
    };
    //posts an unflag on a collection to the server
    postUnflag(passedid, passedemail, callback_fun){
      this.http.post('/api/report', {type: "untakedown", id: passedid, flagged: false, desc: "clicked unflag button", email: passedemail}).subscribe(data => {
          callback_fun(data);
      });
    };
    //posts a new report to the server
    postReport(passedtype, passedname, passeddesc, passedemail, callback_fun){
      this.http.post('/api/report', {type: passedtype, name: passedname, desc: passeddesc, email: passedemail}).subscribe(data => {
          callback_fun(data);
      });
    };
    //gets all reports from server
    getReports(callback_fun){
      this.http.get('/api/report').subscribe(data => {
          callback_fun(data);
      });
    };
    //deletes all reports on the server
    deleteReports(callback_fun){
      this.http.delete('/api/report').subscribe(data => {
          callback_fun(data);
      });
    };
}
