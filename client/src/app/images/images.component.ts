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
  
  currentPublicCollections = [];
  currentPrivateCollections = [];
  currentOpenCollection = -1;
  accessEdit = "private";
  
  openCollection(collectionNumber){
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
      
      if (this._sharedData.getSignInState() == true && element.access == "private" && element.owner == this._sharedData.getEmail()){
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
  
  
  
  
  
  authenticationResponse(res){
    if(res.code == 200 && res.function == "auth"){
      Materialize.toast('Authenticated!', 500, 'rounded');
      this._sharedData.setEmail(res.email);
      this._sharedData.setUsername(res.name);
      this._sharedData.setSignInState(true);
      this.loadImages();
    }
  }
   
  ngOnInit() {
    this._loginService.authenticateToken( this.authenticationResponse.bind(this));
  }

}
