import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';


@Injectable()
export class CollectionService {
    
    constructor(private http: HttpClient) { }
    
    getCollections(callback_fun) {
      this.http.get('/api/collection').subscribe(data => {
          callback_fun(data);
      });
    }
    
    postCollection(email, passedName, passedDesc, passedAccess, callback_fun) {
      this.http.post('/api/collection', {owner: email, name: passedName, desc: passedDesc, access: passedAccess}).subscribe(data => {
          callback_fun(data);
      });
    }
    
    
    
    
    postCollectionGetOwned(passedOwner, callback_fun){
      this.http.post('/api/collection/owned',  {owner: passedOwner}).subscribe(data =>{
          callback_fun(data);
      });
    }
    
    postCollectionEdit(passedCollectionID, newName, newDesc, newAccess, callback_fun){
       this.http.post('/api/collection/editcollection', {name: newName, desc: newDesc, access: newAccess, id: passedCollectionID}).subscribe(data => {
          callback_fun(data);
      });
    }
    
    postCollectionDelete(passedCollectionID, callback_fun){
      this.http.request('delete', '/api/collection/editcollection', {body: {id: passedCollectionID}}).subscribe(data =>{
          callback_fun(data);
      });
    }
    
    
    
    
    
    
    postCollectionAddImage(passedCollectionID, passedLink, callback_fun){
       this.http.post('/api/collection/editimages', {id: passedCollectionID, link: passedLink}).subscribe(data => {
          callback_fun(data);
      });
    }
    
    postCollectionDeleteImage(passedCollectionID, passedLink, callback_fun){
      this.http.request('delete', '/api/collection/editimages', {body: {id: passedCollectionID, link: passedLink}}).subscribe(data =>{
          callback_fun(data);
      });
    }
    
    
    
    
    postCollectionRate(useremail, passedRating, passedCollectionID, callback_fun){
       this.http.post('/api/rate', {email: useremail, rating: passedRating, id: passedCollectionID}).subscribe(data => {
          callback_fun(data);
      });
    }
    
    
    
    
    
    
}
