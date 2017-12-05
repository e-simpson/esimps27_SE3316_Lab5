import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../collection.service';
import { SharedDataService } from '../shared-data.service';
import { LoginService } from '../login.service';



@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css']
})

export class ImagesComponent implements OnInit {

  constructor(private _collectionService: CollectionService, private _sharedData: SharedDataService, private _loginService: LoginService) {}
  
  currentPublicCollections = [];    //holds the current public collections
  currentPrivateCollections = [];   //holds the current private collections, if logged in
  currentOpenCollection = -1;       //holds the current opened collection in the UI
  accessEdit = "private";           //for editing the collections access
  editing = true;                   //toggles editing mode
  editButtonText = "Edit";          //button text changing
  
  //UI button toggling
  toggleEditing(){
    if (this.editing == true){
      this.editing = false;
      this.editButtonText = "Edit";
    }
    else{
      this.editing = true;
      this.editButtonText = "Cancel Editing";
    }
  }
  
  
  openCollection(collectionNumber){
    this.editing = false; this.editButtonText = "Edit";
    if (collectionNumber == this.currentOpenCollection){this.currentOpenCollection = -1;}
    else{this.currentOpenCollection = collectionNumber;}
    this.accessEdit = "private"
  }
  
  processCollections(images){
    var publicCollections = [];
    var privateCollections = [];
        
    var count = 0;
    images.forEach(element => {
      if (!this._sharedData.getSignInState() && count>=10){ return;}
      count++;
       
      element.rating = Math.round((element.totalrate / element.nrates)*10)/10;
      if (!element.rating) { element.rating = 0; }
      element.name = element.name.replace(/\b(\w)/g, s => s.toUpperCase());
      element.length = element.images.length;
      element.images = element.images;
      
      if (element.access == "public"){
        publicCollections.push(element);
      }
      
      if (this._sharedData.getSignInState() == true && element.access == "private" && element.owner == this._sharedData.getEmail() || this._sharedData.getEmail() == "root" && element.access == "private"){
        privateCollections.push(element);
      }
      
    });
    
    publicCollections.sort(function(obj1, obj2){ return  obj2.rating - obj1.rating;});
    privateCollections.sort(function(obj1, obj2){ return  obj2.rating - obj1.rating;});

    this.currentPublicCollections = publicCollections;
    this.currentPrivateCollections = privateCollections;

  }
  
  loadImages(){
    this._collectionService.getCollections(this.processCollections.bind(this));
  }
  
  
  
  removeImageFromCollection(collectionID, link){
    this._collectionService.postCollectionDeleteImage(collectionID, link, this.removeImageResponse) 
  }
  
  removeImageResponse(res){
    if(res.code == 200 && res.function == "removeImage"){
      // Materialize.toast('Delete successful!', 3000, 'rounded')
      location.reload();
    }
  }
  
   
   
   
  submitRating(rating, collectionID){
    this._collectionService.postCollectionRate(this._sharedData.getEmail(), parseInt(rating), collectionID, this.ratingResponse)
  }
  
  ratingResponse(res){
    if(res.code == 200 && res.function == "rate"){
      // Materialize.toast('Delete successful!', 3000, 'rounded')
      location.reload();
    }
  }
  
  
  
  
  
  toggleAccess(){
    if (this.accessEdit == "private"){ this.accessEdit = "public";}
    else{ this.accessEdit = "private";}
  }
  
  submitCollectionEdit(collectionID, name, description){
    this._collectionService.postCollectionEdit(collectionID, name, description, this.accessEdit, this.submitCollectionEditResponse);
  }
  
  submitCollectionEditResponse(res){
    if(res.code == 200 && res.function == "edit"){
      // Materialize.toast('Delete successful!', 3000, 'rounded')
      location.reload();
    }
  }
  
  
  
  
  
  
  submitCollectionDelete(collectionID){
    this._collectionService.postCollectionDelete(collectionID, this.submitCollectionDeleteResponse);
  }
  
  submitCollectionDeleteResponse(res){
    if(res.code == 200 && res.function == "delete"){
      // Materialize.toast('Delete successful!', 3000, 'rounded')
      location.reload();
    }
  }
  
  
  
  
  submitFlag(collectionID){
    this._loginService.postFlag(collectionID, this._sharedData.getEmail(), this.flagResponse.bind(this));
  }
  flagResponse(data){
    Materialize.toast('Takedown Successful!', 4000, 'rounded');
  }
  
  
  submitUnflag(collectionID){
    this._loginService.postUnflag(collectionID, this._sharedData.getEmail(), this.unflagResponse.bind(this));
  }
  unflagResponse(data){
    Materialize.toast('Flag removed!', 4000, 'rounded');
  }
  
  
  authenticationResponse(res){
    if(res && res.code == 200 && res.function == "auth"){
      Materialize.toast('Authenticated!', 500, 'rounded');
      this._sharedData.setEmail(res.email);
      this._sharedData.setUsername(res.name);
      this._sharedData.setSignInState(true);
    }
    else {
      Materialize.toast('Welcome Guest! Consider making an account!', 4000, 'rounded');
    }
    this.loadImages();
  }
   
  ngOnInit() {
    this._loginService.authenticateToken( this.authenticationResponse.bind(this));
  }

}
