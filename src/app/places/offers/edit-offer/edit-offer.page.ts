import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlacesService } from '../../places.service';
import { PlaceModel } from '../../place.model';
import { NavController } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
  standalone: false,
})
export class EditOfferPage implements OnInit {
  place?: PlaceModel;
  form?: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (params.has('placeId')) {
        this.place = this.placesService.getPlace(params.get('placeId')!) as PlaceModel ?? undefined;
        this.form = new FormGroup({
          title: new FormControl(
            this.place.title,
            {
              updateOn: 'blur',
              validators: [Validators.required]
            }
          ),
          description: new FormControl(
            this.place.description,
            {
              updateOn: 'blur',
              validators: [Validators.required, Validators.maxLength(180)]
            }
          ),
        });
        return;
      }
      this.navCtrl.navigateBack('/places/tabs/offers');
    })
  }

  onUpdateOffer() {
    console.log(this.form);
  }

}
