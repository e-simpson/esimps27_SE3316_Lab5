import { Injectable } from '@angular/core';


//object used to store shared data accross the app
//useful in updating sign in state

@Injectable()
export class SharedDataService {
    signedIn = false;
    signInDisplayed = false;
    username = "Guest";
    email = "";
    
    constructor() { }


    getUsername(){return this.username;}
    setUsername(name){return this.username = name;}
    
    getEmail(){return this.email;}
    setEmail(name){return this.email = name;}
    
    getSignInDisplayed(){return this.signInDisplayed;}
    setSignInDisplayed(state){ return this.signInDisplayed = state;}
    
    getSignInState(){return this.signedIn;}
    setSignInState(state){return this.signedIn = state;}
}
