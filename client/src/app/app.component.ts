import { Component } from '@angular/core';
import { SharedDataService } from './shared-data.service'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
    constructor(private _sharedData: SharedDataService) {  }
}
