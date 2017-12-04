import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';



@Injectable()
export class SearchService {

    constructor(private http: HttpClient) { }
    
    retrieveSearch(searchTerms, callback_fun) {
        this.http.get('https://images-api.nasa.gov/search?q=' + searchTerms.replace(" ", "%") + "&media_type=image").subscribe(data => {
            callback_fun(data);
        });
    }
}
