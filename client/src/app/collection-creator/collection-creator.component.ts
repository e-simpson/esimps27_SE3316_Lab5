import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../collection.service';
import { SharedDataService } from '../shared-data.service';

@Component({
  selector: 'app-collection-creator',
  templateUrl: './collection-creator.component.html',
  styleUrls: ['./collection-creator.component.css']
})



//responsible for collection creation
export class CollectionCreatorComponent implements OnInit {
  open = false; 
  access = "private"; //default access
  response = '';
  
  constructor(private _collectionService: CollectionService, private _sharedData: SharedDataService) {}

  ngOnInit() {}
  
  //used for UI opening and closing
  toggleOpen(){
    if (this.open == true){ this.open = false;}
    else{ this.open = true;}
  }
  
  //used for UI opening and closing
  toggleAccess(){
    this.resetResponse();
    if (this.access == "private"){ this.access = "public";}
    else{ this.access = "private";}
  }
  
  resetResponse(){ this.response = ''; }

  
  
  
  //checks if the collection form is filled out, if so post it to the server with the collection service
  submitCollectionForm(name, desc) {
    if (name == ""){
      this.response = "Please enter a name.";
      return;
    }
    else if (desc == ""){
      this.response = "Please enter a description.";
      return;
    }
    
    this._collectionService.postCollection(this._sharedData.getEmail(), name, desc, this.access, this.submitCollectionResponse.bind(this));
  }
  
  //signifies successful collection creation to the user with a reload
  submitCollectionResponse(res) { 
    this.response = res.message;
    if (res.function == "newCollection" && res.code == 200){
      location.reload();
    }
  }

}
