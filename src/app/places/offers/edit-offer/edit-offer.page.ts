import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlacesService } from '../../places.service';
import { PlaceModel } from '../../place.model';
import { LoadingController, NavController } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, from, Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
  standalone: false,
})
export class EditOfferPage implements OnInit, OnDestroy {
  place?: PlaceModel;
  form?: FormGroup;
  private placesSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private navCtrl: NavController,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      if (params.has('placeId')) {
        this.placesSub = this.placesService
          .getPlace(params.get('placeId')!)
          .subscribe((place) => {
            this.place = place;
            this.form = new FormGroup({
              title: new FormControl(this.place.title, {
                updateOn: 'blur',
                validators: [Validators.required],
              }),
              description: new FormControl(this.place.description, {
                updateOn: 'blur',
                validators: [Validators.required, Validators.maxLength(180)],
              }),
            });
          });
        return;
      }
      // this.navCtrl.navigateBack('/places/tabs/offers');
    });
  }

  ngOnDestroy(): void {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

  onUpdateOffer() {
    console.log(this.form);
    if (this.form?.invalid) {
      return;
    }
    from(
      this.loadingCtrl.create({
        message: 'Updating place',
      })
    )
      .pipe(
        switchMap((loadingEl) => {
          loadingEl.present();
          return this.placesService
            .updatePlace(
              this.place?.id!,
              this.place?.title!,
              this.place?.description!
            )
            .pipe(
              finalize(() => {
                loadingEl.dismiss();
                this.form?.reset();
                this.router.navigate(['/places/tabs/offers']);
              })
            );
        })
      )
      .subscribe();
  }
}
