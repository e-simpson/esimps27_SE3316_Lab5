import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class CollectionService {
    
    constructor(private http: HttpClient) { }
    
    getCollections(callback_fun) {
      this.http.get('/api/image').subscribe(data => {
          callback_fun(data);
      });
    }
    
    postCollection(email, passedName, passedDesc, passedAccess, callback_fun) {
      this.http.post('/api/image', {owner: email, name: passedName, desc: passedDesc, access: passedAccess}).subscribe(data => {
          callback_fun(data);
      });
    }
    
    sendCollectionRate(useremail, passedRating, passedCollectionID, callback_fun){
       this.http.post('/api/rate', {email: useremail, rating: passedRating, id: passedCollectionID}).subscribe(data => {
          callback_fun(data);
      });
    }
}
