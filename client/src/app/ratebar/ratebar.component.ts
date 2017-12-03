import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../collection.service';
import { SharedDataService } from '../shared-data.service';

@Component({
  selector: 'app-ratebar',
  templateUrl: './ratebar.component.html',
  styleUrls: ['./ratebar.component.css']
})
export class RatebarComponent implements OnInit {

  constructor(private _collectionService: CollectionService, private _sharedData: SharedDataService) {}

  ngOnInit() {
  }

}
