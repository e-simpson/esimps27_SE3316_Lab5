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
  
  showingReports = false;
  showReportsButtonText = "View Reports";
  
  showingInstructions = false;
  showInstructionsButtonText = "SHOW ADMIN INSTRUCTIONS";

  showingReportCreate = false;
  showReportButtonText = "File a report";
  reportError = "";
  
  currentReports = [];
  
  
  constructor(private _loginService: LoginService, private _sharedData: SharedDataService) { }
  
  
  toggleReportCreate(){
    if (this.showingReportCreate == true){
      this.showingReportCreate = false;
      this.showReportButtonText = "File a report";
    }
    else{
      this.showingReportCreate = true;
      this.showReportButtonText = "Cancel report";
    }
  }
  
  
  toggleViewReports(){
    if (this.showingReports == true){
      this.showingReports = false;
      this.showReportsButtonText = "View reports";
    }
    else{
      this._loginService.getReports(this.getReportsReponse.bind(this));
      this.showingReports = true;
      this.showReportsButtonText = "Hide reports";
    }
  }
  
  toggleInstructions(){
    if (this.showingInstructions == true){
      this.showingInstructions = false;
      this.showInstructionsButtonText = "SHOW ADMIN INSTRUCTIONS";
    }
    else{
      this.showingInstructions = true;
      this.showInstructionsButtonText = "HIDE ADMIN INSTRUCTIONS";
    }
  }
  
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
    if(data.code == 200 && data.function == "policyChange"){
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
  
  
  
  submitReport(type, name, desc, email) {
    if (type == ""){
      this.reportError = "Please enter a report type.";
      return;
    }
    else if (name == ""){
      this.reportError = "Please enter a link or offending collection name.";
      return;
    }
    else if (desc == ""){
      this.reportError = "Please enter a description.";
      return;
    }
    else if (email == ""){
      this.reportError = "Please enter a valid email.";
      return;
    }
    
    this.reportError = ""
    this._loginService.postReport(type, name, desc, email, this.submitReportResponse.bind(this));
  }
  submitReportResponse(){Materialize.toast('Report submitted. Thank you.', 3000, 'rounded');}
  
  getReportsReponse(response){this.currentReports = response;}
  
  deleteAllReports(){this._loginService.deleteReports(this.deleteReportsResponse.bind(this));}
  deleteReportsResponse(){Materialize.toast('All reports deleted.', 3000, 'rounded');}

  
  ngOnInit() {
    this._loginService.getPolicies(this.getPolicyResponse.bind(this));
    this._loginService.getDMCA(this.getDMCAResponse.bind(this));
  }
  

}
