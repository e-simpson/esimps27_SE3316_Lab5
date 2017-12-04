import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../collection.service';
import { SharedDataService } from '../shared-data.service';


@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css']
})

export class ImagesComponent implements OnInit {

  constructor(private _collectionService: CollectionService, private _sharedData: SharedDataService) {}
  
  currentPublicCollections = [];
  currentPrivateCollections = [];
  currentOpenCollection = -1;
  
  openCollection(collectionNumber){
    if (collectionNumber == this.currentOpenCollection){this.currentOpenCollection = -1;}
    else{this.currentOpenCollection = collectionNumber;}
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
    this.currentPrivateCollections = publicCollections;
  }
  
  loadImages(){
    this._collectionService.getCollections(this.processCollections.bind(this));
  }
  
  

   
  
   
   
  submitRating(rating, collectionID){
    this._collectionService.sendCollectionRate(this._sharedData.getEmail(), parseInt(rating), collectionID, this.ratingResponse)
  }
  
  ratingResponse(){
    location.reload();
  }
  
  
  

  ngOnInit() {this.loadImages();}

}
