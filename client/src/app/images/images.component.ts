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
  
  currentImages = [];
  currentOpenCollection = -1;

  capitalizeName(name) {
    return name.replace(/\b(\w)/g, s => s.toUpperCase());
  }

  getNames(images){
    
    var list = [];
        
    var count = 0;
    images.forEach(element => {
      if (element.access == "public"){
        if (count>=10){ return;}
        count++;
        element.rating = Math.round((element.totalrate / element.nrates)*10)/10;
        if (!element.rating) { element.rating = 0; }
        element.name = this.capitalizeName(element.name);
        element.number = count;
        element.length = element.images.length;
        element.images = element.images;
        list.push(element);
      }
    });
    
    list.sort(function(obj1, obj2){
      return  obj2.rating - obj1.rating;
    });
    
    this.currentImages = list;
  }
  
  loadImages(){
    this._collectionService.getImages(this.getNames.bind(this));
  }
  
  openCollection(collectionNumber){
    if (collectionNumber == this.currentOpenCollection){
      this.currentOpenCollection = -1;
    }
    else{
      this.currentOpenCollection = collectionNumber;
    }
  }

  ngOnInit() {
    this.loadImages();
  }

}
