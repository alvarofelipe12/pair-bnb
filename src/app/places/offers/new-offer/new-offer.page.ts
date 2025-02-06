import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PlacesService } from '../../places.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { finalize, from, switchMap } from 'rxjs';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
  standalone: false,
})
export class NewOfferPage implements OnInit {
  form: FormGroup;

  constructor(
    private placesService: PlacesService,
    private router: Router,
    private loadingCtrl: LoadingController
  ) {
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)],
      }),
      price: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)],
      }),
      dateFrom: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      dateTo: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
    });
  }

  ngOnInit() {}

  onCreateOffer() {
    console.log('Creating offered place...');
    if (this.form.invalid) {
      return;
    }
    from(
      this.loadingCtrl.create({
        message: 'Creating place...',
      })
    )
      .pipe(
        switchMap((loadingEl) => {
          loadingEl.present();
          return this.placesService
            .addPlace(
              this.form.get('title')?.value,
              this.form.get('description')?.value,
              this.form.get('price')?.value,
              new Date(this.form.get('dateFrom')?.value),
              new Date(this.form.get('dateTo')?.value)
            )
            .pipe(
              finalize(() => {
                loadingEl.dismiss();
                this.form.reset();
                this.router.navigate(['/places/tabs/offers']);
              })
            );
        })
      )
      .subscribe();
  }
}
