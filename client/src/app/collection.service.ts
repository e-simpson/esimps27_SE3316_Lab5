import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';


@Injectable()
export class CollectionService {
    
    constructor(private http: HttpClient) { }
    
    
    //gets all collections from server
    getCollections(callback_fun) {
      this.http.get('/api/collection').subscribe(data => {
          callback_fun(data);
      });
    }
    
    //posts a new collection to the server
    postCollection(email, passedName, passedDesc, passedAccess, callback_fun) {
      this.http.post('/api/collection', {owner: email, name: passedName, desc: passedDesc, access: passedAccess}).subscribe(data => {
          callback_fun(data);
      });
    }
    
    
    
    //gets all owned collections from server (from one user)
    postCollectionGetOwned(passedOwner, callback_fun){
      this.http.post('/api/collection/owned',  {owner: passedOwner}).subscribe(data =>{
          callback_fun(data);
      });
    }
    
    //posts collection edits to the server
    postCollectionEdit(passedCollectionID, newName, newDesc, newAccess, callback_fun){
       this.http.post('/api/collection/editcollection', {name: newName, desc: newDesc, access: newAccess, id: passedCollectionID}).subscribe(data => {
          callback_fun(data);
      });
    }
    
    //deletes a collection on the server
    postCollectionDelete(passedCollectionID, callback_fun){
      this.http.request('delete', '/api/collection/editcollection', {body: {id: passedCollectionID}}).subscribe(data =>{
          callback_fun(data);
      });
    }
    
    
    
    
    
    //post a new image to a collection on the server
    postCollectionAddImage(passedCollectionID, passedLink, callback_fun){
       this.http.post('/api/collection/editimages', {id: passedCollectionID, link: passedLink}).subscribe(data => {
          callback_fun(data);
      });
    }
    
    //posts a delete collection on the server
    postCollectionDeleteImage(passedCollectionID, passedLink, callback_fun){
      this.http.request('delete', '/api/collection/editimages', {body: {id: passedCollectionID, link: passedLink}}).subscribe(data =>{
          callback_fun(data);
      });
    }
    
    
    
    //posts a new rating from a user on a collection to the server
    postCollectionRate(useremail, passedRating, passedCollectionID, callback_fun){
       this.http.post('/api/rate', {email: useremail, rating: passedRating, id: passedCollectionID}).subscribe(data => {
          callback_fun(data);
      });
    }
    
    
    
    
    
    
}
