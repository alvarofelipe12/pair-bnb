import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { PlaceModel } from '../../place.model';
import { ActivatedRoute } from '@angular/router';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss'],
  standalone: false,
})
export class OfferBookingsPage implements OnInit {
  place?: PlaceModel;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private placesService: PlacesService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(param => {
      if (param.has('placeId')) {
        this.place = this.placesService.getPlace(param.get('placeId')!) as PlaceModel;
        return;
      }
      this.onBookOffer();
    })
  }

  onBookOffer() {
    this.navCtrl.navigateBack('/places/tabs/offers');
  }

}
