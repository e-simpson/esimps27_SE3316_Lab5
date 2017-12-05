import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../shared-data.service'
import { SearchService } from '../search.service'
import { CollectionService } from '../collection.service'



@Component({
  selector: 'app-appbar',
  templateUrl: './appbar.component.html',
  styleUrls: ['./appbar.component.css']
})

//responsible for the top navigation bar, includes showing SEARCH and its results
export class AppbarComponent implements OnInit {
  searchResults = [];     //holds search results json
  currentPage = 1;        //holds the current page of search results
  pagesArray = [];        //holds all the page numbers in the search
  ownedCollections = [];  //holds the collections the user owns (for adding photos to collection)
  photoToAdd = "";        //signifies the photo to add
  
  constructor(private _sharedData: SharedDataService, private _searchService: SearchService, private _collectionService: CollectionService) { }

  //UI toggling
  setAddingToLink(link){
    if (this.photoToAdd == link){
      this.photoToAdd = ""
    }
    else{
      this.photoToAdd = link;  
    }
  }


  //ui toggling
  toggleSignIn(){
    if (this._sharedData.getSignInDisplayed() == true){this._sharedData.setSignInDisplayed(false);}
    else{this._sharedData.setSignInDisplayed(true);}
  }
  
  //responsible for signing out the user
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
  
  //resets the search bar to default OFF state
  resetSearch(){this.searchResults = []; this.currentPage = 1; this.pagesArray = [];}
  
  
  //adds an image to a collection using the collection service
  addImageFromCollection(collectionID, link){
    this._collectionService.postCollectionAddImage(collectionID, link, this.addImageResponse)
  }
  
  //displays add image success to user
  addImageResponse(res){
    if(res.code == 200 && res.function == "addImage"){
      Materialize.toast('Added image to ' + res.name + '!', 3000, 'rounded')
    }
  }
  
  
  
  //sends a search query to NASA's image base using the collection service, also retrieves the collections owned by the current user (for adding images)
  sendSearch(searchInput){
    this._collectionService.postCollectionGetOwned(this._sharedData.getEmail(), this.saveOwnedCollections.bind(this));

    this._searchService.retrieveSearch(searchInput, this.searchResponse.bind(this));
  }
  
  //on successful search, this will display all of the search results, it formats the results to neat json objects
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
  
  //saves the retrieved owned collections locally for later use
  saveOwnedCollections(response){
    var list = [];
  
    response.forEach(element => {
      list.push({'id': element._id, 'name': element.name});
    });
    
    this.ownedCollections = list;
  }
  
  
  //changes the current page in the search results
  changeSearchPage(pageNumber){this.currentPage = pageNumber;}


  ngOnInit() { 
    // setTimeout(function() { this.sendSearch("apollo"); }, 500);
  }

}
