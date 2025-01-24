import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { PlaceModel } from '../../place.model';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
  standalone: false,
})
export class PlaceDetailPage implements OnInit {
  place?: PlaceModel;

  constructor(
    private navCtrl: NavController,
    // private router: Router,
    private route: ActivatedRoute,
    private placesService: PlacesService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (params.has('placeId')) {
        this.place = this.placesService.getPlace(params.get('placeId')!) as PlaceModel ?? undefined;
        return;
      }
      this.onBookPlace();
    });
  }

  onBookPlace() {
    // this.router.navigateByUrl('/places/tabs/discover'); //animation wrong
    this.navCtrl.navigateBack('/places/tabs/discover');
    // this.navCtrl.pop(); // unreliable in case page reloaded by some mean
  }

}
