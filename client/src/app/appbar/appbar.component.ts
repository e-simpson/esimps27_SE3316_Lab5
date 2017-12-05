import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../shared-data.service'
import { SearchService } from '../search.service'
import { CollectionService } from '../collection.service'



@Component({
  selector: 'app-appbar',
  templateUrl: './appbar.component.html',
  styleUrls: ['./appbar.component.css']
})

export class AppbarComponent implements OnInit {
  searchResults = [];
  currentPage = 1;
  pagesArray = [];
  ownedCollections = [];
  
  photoToAdd = "";
  
  setAddingToLink(link){
    if (this.photoToAdd == link){
      this.photoToAdd = ""
    }
    else{
      this.photoToAdd = link;  
    }
  }

  constructor(private _sharedData: SharedDataService, private _searchService: SearchService, private _collectionService: CollectionService) { }


  toggleSignIn(){
    if (this._sharedData.getSignInDisplayed() == true){this._sharedData.setSignInDisplayed(false);}
    else{this._sharedData.setSignInDisplayed(true);}
  }
  
  toggleSignInState(){
    if (this._sharedData.getSignInState() == true){
      this._sharedData.setSignInState(false);
      this._sharedData.setSignInDisplayed(false);
      this._sharedData.username = "Guest";
      this._sharedData.email = "Guest";
      localStorage.clear();
      window.location.reload();
    }
    else{this._sharedData.setSignInState(true);}
  }
  
  resetSearch(){this.searchResults = []; this.currentPage = 1; this.pagesArray = [];}
  
  
  
  
  addImageFromCollection(collectionID, link){
    this._collectionService.postCollectionAddImage(collectionID, link, this.addImageResponse)
  }
  
  addImageResponse(res){
    if(res.code == 200 && res.function == "addImage"){
      Materialize.toast('Added image to ' + res.name + '!', 3000, 'rounded')
    }
  }
  
  
  
  
  sendSearch(searchInput){
    this._collectionService.postCollectionGetOwned(this._sharedData.getEmail(), this.saveOwnedCollections.bind(this));

    this._searchService.retrieveSearch(searchInput, this.searchResponse.bind(this));
  }
  
  searchResponse(response){
    this.resetSearch();
    
    var list = [];
    
    (response.collection.items).forEach(element => {
      list.push({'link': element.links[0].href, 'date': element.data[0].date_created, 'title': element.data[0].title, 'desc': element.data[0].description});
    });
    
    for (var n = 1; n <= Math.ceil(list.length/10); n++){
      this.pagesArray.push(n);
    }
    
    this.searchResults = list;
    Materialize.toast( list.length + ' results found', 1000, 'rounded')

  }
  
  saveOwnedCollections(response){
    var list = [];
  
    response.forEach(element => {
      list.push({'id': element._id, 'name': element.name});
    });
    
    this.ownedCollections = list;
  }
  
  
  changeSearchPage(pageNumber){this.currentPage = pageNumber;}


  ngOnInit() { 
    // setTimeout(function() { this.sendSearch("apollo"); }, 500);
  }

}
