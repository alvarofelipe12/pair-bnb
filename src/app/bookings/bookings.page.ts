import { Component, OnDestroy, OnInit } from '@angular/core';
import { BookingService } from './booking.service';
import { BookingModel } from './booking.model';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { finalize, from, Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
  standalone: false,
})
export class BookingsPage implements OnInit, OnDestroy {
  loadedBookings?: BookingModel[];
  private bookingSub?: Subscription;

  constructor(
    private bookingService: BookingService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.bookingSub = this.bookingService.bookings.subscribe((bookings) => {
      this.loadedBookings = bookings;
    });
  }

  ngOnDestroy(): void {
    if (this.bookingSub) {
      this.bookingSub.unsubscribe();
    }
  }

  onCancelBooking(offerId: string, slidingEl: IonItemSliding) {
    slidingEl.close();
    // cancel booking with an offer id
    from(
      this.loadingCtrl.create({
        message: 'Cancelling...',
      })
    )
      .pipe(
        switchMap((loadingEl) => {
          loadingEl.present();
          return this.bookingService
            .cancelBooking(offerId)
            .pipe(finalize(() => loadingEl.dismiss()));
        })
      )
      .subscribe();
  }
}
