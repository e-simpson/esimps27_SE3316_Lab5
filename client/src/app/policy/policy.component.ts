import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service'
import { SharedDataService } from '../shared-data.service'



@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.css']
})
export class PolicyComponent implements OnInit {
  policyButtonText = "SHOW POLICIES";
  showingPolicy = false;
  currentSecurityPolicy = "";
  currentPrivacyPolicy = "";
  
  dmcaButtonText = "SHOW DMCA & TAKEDOWN POLICY";
  showingDMCA = false;
  currentDMCA = "";
  currentTakedown = "";
  
  constructor(private _loginService: LoginService, private _sharedData: SharedDataService) { }
  
  
  togglePolicy(){
    if (this.showingPolicy == true){
      this.showingPolicy = false;
      this.policyButtonText = "SHOW POLICIES";
    }
    else{
      this.showingPolicy = true;
      this.policyButtonText = "HIDE POLICIES";
    }
  }
  
  toggleDMCA(){
    if (this.showingDMCA == true){
      this.showingDMCA = false;
      this.dmcaButtonText = "SHOW DMCA & TAKEDOWN POLICY";
    }
    else{
      this.showingDMCA = true;
      this.dmcaButtonText = "HIDE DMCA & TAKEDOWN POLICY";
    }
  }
  
  
  
  getPolicyResponse(data){
    this.currentPrivacyPolicy = data[0].privacy;
    this.currentSecurityPolicy = data[0].security;
  }
  
  postChangedPolicy(security, privacy){
      this._loginService.postNewPolicy(security, privacy, this.getPolicyResponse.bind(this));
  }
  postPolicyResponse(data){
    if(res.code == 200 && res.function == "policyChange"){
      Materialize.toast('Policy change successful! Please reload the page.', 3000, 'rounded')
    }
  }
  
   
  getDMCAResponse(data){
    this.currentDMCA = data[0].dmca;
    this.currentTakedown = data[0].takedown;
  }
  
  postChangedDMCA(dmca, takedown){
      this._loginService.postNewDMCA(dmca, takedown, this.postDMCAResponse.bind(this));
  }
  postDMCAResponse(data){
    if(data.code == 200 && data.function == "dmcaChange"){
      Materialize.toast('DMCA & Takedown change successful! Please reload the page.', 3000, 'rounded')
    }
  }
  
  
  
  ngOnInit() {
    this._loginService.getPolicies(this.getPolicyResponse.bind(this));
    this._loginService.getDMCA(this.getDMCAResponse.bind(this));
  }
  

}
