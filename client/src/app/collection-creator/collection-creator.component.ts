import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../collection.service';
import { SharedDataService } from '../shared-data.service';

@Component({
  selector: 'app-collection-creator',
  templateUrl: './collection-creator.component.html',
  styleUrls: ['./collection-creator.component.css']
})

export class CollectionCreatorComponent implements OnInit {
  open = false;
  access = "private"
  response = '';
  
  constructor(private _collectionService: CollectionService, private _sharedData: SharedDataService) {}

  ngOnInit() {
  }
  
  toggleOpen(){
    if (this.open == true){ this.open = false;}
    else{ this.open = true;}
  }
  
  toggleAccess(){
    this.resetResponse();
    if (this.access == "private"){ this.access = "public";}
    else{ this.access = "private";}
  }
  
  resetResponse(){ this.response = ''; }

  
  submitCollectionForm(name, desc) {
    if (name == ""){
      this.response = "Please enter a name.";
      return;
    }
    else if (desc == ""){
      this.response = "Please enter a description.";
      return;
    }
    
    this._collectionService.postCollection(this._sharedData.getEmail(), name, desc, this.access, this.onResponse.bind(this));
  }
  
  onResponse(res) { 
    this.response = res.message;
    if (res.function == "newCollection" && res.code == 200){
      // this.Open();
      // window.location.reload();
    }
  }

}
