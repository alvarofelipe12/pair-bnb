import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../places.service';
import { PlaceModel } from '../place.model';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
  standalone: false,
})
export class OffersPage implements OnInit {
  loadedPlaces: PlaceModel[] = [];

  constructor(private placesService: PlacesService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.loadedPlaces = this.placesService.places.slice(this.placesService.places.length - 1);
  }

}
