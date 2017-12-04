import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../shared-data.service'
import { SearchService } from '../search.service'


@Component({
  selector: 'app-appbar',
  templateUrl: './appbar.component.html',
  styleUrls: ['./appbar.component.css']
})

export class AppbarComponent implements OnInit {
  searchResults = []
  
  constructor(private _sharedData: SharedDataService, private _searchService: SearchService) { }

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
  
  resetSearch(){
    this.searchResults = [];
  }
  
  sendSearch(searchInput){
    this._searchService.retrieveSearch(searchInput, this.searchResponse.bind(this));
  }
  
  searchResponse(response){
    var list = [];
      
    // var count = 0;
    (response.collection.items).forEach(element => {
      // if (count>=10){ return;}; count++;
      var formattedElement = {'link': element.links[0].href, 'date': element.data[0].date_created, 'title': element.data[0].title, 'desc': element.data[0].description};
      list.push(formattedElement);
    });
    
    this.searchResults = list;
  }

  ngOnInit() { }

}
