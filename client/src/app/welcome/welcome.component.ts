import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../shared-data.service'

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})

export class WelcomeComponent implements OnInit {
  
  constructor(private _sharedData: SharedDataService) { }

  ngOnInit() {
    
  }

}
