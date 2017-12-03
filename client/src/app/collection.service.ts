import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class CollectionService {
    
    constructor(private http: HttpClient) { }
    
    getImages(callback_fun) {
      this.http.get('/api/image').subscribe(data => {
          callback_fun(data);
      });
    }
}
