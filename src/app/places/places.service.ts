import { Injectable } from '@angular/core';
import { PlaceModel } from './place.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, delay, map, Observable, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<PlaceModel[]>(
    [
      new PlaceModel(
        'p1',
        'Manhattan Mansion',
        'In the heart of New York City',
        'https://thumbs.6sqft.com/wp-content/uploads/2014/06/21042533/Carnegie-Mansion-nyc.jpg?w=800&format=webp',
        189.99,
        new Date('2019-01-01'),
        new Date('2019-12-31'),
        'abc'
      ),
      new PlaceModel(
        'p2',
        'L\'Amour Tojours',
        'A romantic place in Paris!',
        'https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F910ab553-b05e-4473-b9cd-3479e619fe70_1280x1707.jpeg',
        149.99,
        new Date('2019-01-01'),
        new Date('2019-12-31'),
        'abc'
      ),
      new PlaceModel(
        'p3',
        'The Foggy Palace',
        'Not your average city trip',
        'https://images.stockcake.com/public/7/3/a/73aa1b9c-f775-40d3-b0b8-e0e9d6e639dc_large/mystical-foggy-castle-stockcake.jpg',
        99.99,
        new Date('2019-01-01'),
        new Date('2019-12-31'),
        'abc'
      ),
    ]
  );

  get places() {
    return this._places.asObservable();
  }

  constructor(
    private authService: AuthService
  ) { }

  getPlace(id: string): Observable<PlaceModel> {
    return this.places.pipe(
      take(1),
      map(places => {
        return { ...places.find(p => p.id === id) } as PlaceModel;
      }),
    );
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
    const newPlace = new PlaceModel(
      Math.random().toString(),
      title,
      description,
      'https://images.stockcake.com/public/7/3/a/73aa1b9c-f775-40d3-b0b8-e0e9d6e639dc_large/mystical-foggy-castle-stockcake.jpg',
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );
    // this._places.push(newPlace);
    return this._places.pipe(
      take(1),
      delay(1000),
      tap(places => {
        this._places.next(places.concat(newPlace));
      }),
    );
  }

  updatePlace(placeId: string, title: string, description: string) {
    return this.places.pipe(
      take(1),
      delay(1000),
      tap(places => {
        const updatedPlaceIndex = places.findIndex(p => p.id === placeId);
        const updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new PlaceModel(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId
        );
        this._places.next(updatedPlaces);
      }),
    )
  }
}
