import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { PlaceModel } from '../../place.model';
import { ActivatedRoute } from '@angular/router';
import { PlacesService } from '../../places.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss'],
  standalone: false,
})
export class OfferBookingsPage implements OnInit, OnDestroy {
  place?: PlaceModel;
  private placesSub?: Subscription;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private placesService: PlacesService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((param) => {
      if (param.has('placeId')) {
        this.placesSub = this.placesService
          .getPlace(param.get('placeId')!)
          .subscribe((place) => {
            this.place = place;
          });
        return;
      }
      this.onBookOffer();
    });
  }

  ngOnDestroy(): void {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

  onBookOffer() {
    this.navCtrl.navigateBack('/places/tabs/offers');
  }
}
