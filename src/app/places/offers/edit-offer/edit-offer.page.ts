import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlacesService } from '../../places.service';
import { PlaceModel } from '../../place.model';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
  standalone: false,
})
export class EditOfferPage implements OnInit {
  place?: PlaceModel;

  constructor(
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (params.has('placeId')) {
        this.place = this.placesService.getPlace(params.get('placeId')!) as PlaceModel ?? undefined;
        return;
      }
      this.navCtrl.navigateBack('/places/tabs/offers');
    })
  }

}
