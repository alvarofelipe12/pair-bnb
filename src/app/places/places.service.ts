import { Injectable } from '@angular/core';
import { PlaceModel } from './place.model';
import { AuthService } from '../auth/auth.service';
import {
  BehaviorSubject,
  delay,
  map,
  Observable,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';

// [
//   new PlaceModel(
//     'p1',
//     'Manhattan Mansion',
//     'In the heart of New York City',
//     'https://thumbs.6sqft.com/wp-content/uploads/2014/06/21042533/Carnegie-Mansion-nyc.jpg?w=800&format=webp',
//     189.99,
//     new Date('2019-01-01'),
//     new Date('2019-12-31'),
//     'xyz'
//   ),
//   new PlaceModel(
//     'p2',
//     "L'Amour Tojours",
//     'A romantic place in Paris!',
//     'https://substackcdn.com/image/fetch/w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fbucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com%2Fpublic%2Fimages%2F910ab553-b05e-4473-b9cd-3479e619fe70_1280x1707.jpeg',
//     149.99,
//     new Date('2019-01-01'),
//     new Date('2019-12-31'),
//     'abc'
//   ),
//   new PlaceModel(
//     'p3',
//     'The Foggy Palace',
//     'Not your average city trip',
//     'https://images.stockcake.com/public/7/3/a/73aa1b9c-f775-40d3-b0b8-e0e9d6e639dc_large/mystical-foggy-castle-stockcake.jpg',
//     99.99,
//     new Date('2019-01-01'),
//     new Date('2019-12-31'),
//     'abc'
//   ),
// ];

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places = new BehaviorSubject<PlaceModel[]>([]);

  get places() {
    return this._places.asObservable();
  }

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient
  ) {}

  fetchPlaces() {
    return this.httpClient
      .get<{
        // build a not know key name which have inside and object
        // the given object don't contain id and availableFrom,availableTo are strings
        [key: string]: Omit<
          PlaceModel,
          'id' | 'availableFrom' | 'availableTo'
        > & { availableFrom: string; availableTo: string };
      }>(
        'https://pairbnb-1e341-default-rtdb.firebaseio.com/offered-places.json'
      )
      .pipe(
        map((resData) => {
          const places = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              places.push(
                new PlaceModel(
                  key,
                  resData[key].title,
                  resData[key].description,
                  resData[key].imageUrl,
                  resData[key].price,
                  new Date(resData[key].availableFrom),
                  new Date(resData[key].availableTo),
                  resData[key].userId
                )
              );
            }
          }
          return places;
        }),
        tap((places) => {
          this._places.next(places);
        })
      );
  }

  getPlace(id: string): Observable<PlaceModel> {
    return this.places.pipe(
      take(1),
      map((places) => {
        return { ...places.find((p) => p.id === id) } as PlaceModel;
      })
    );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    let generatedId: string;
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
    return this.httpClient
      .post<{ name: string }>(
        'https://pairbnb-1e341-default-rtdb.firebaseio.com/offered-places.json',
        { ...newPlace, id: null }
      )
      .pipe(
        switchMap((resData) => {
          generatedId = resData.name;
          return this.places;
        }),
        take(1),
        tap((places) => {
          newPlace.id = generatedId;
          this._places.next(places.concat(newPlace));
        })
      );
    // this._places.push(newPlace);
    // return this._places.pipe(
    //   take(1),
    //   delay(1000),
    //   tap(places => {
    //     this._places.next(places.concat(newPlace));
    //   }),
    // );
  }

  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: PlaceModel[];
    return this.places.pipe(
      take(1),
      switchMap((places) => {
        const updatedPlaceIndex = places.findIndex((p) => p.id === placeId);
        updatedPlaces = [...places];
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
        return this.httpClient.put(
          `https://pairbnb-1e341-default-rtdb.firebaseio.com/offered-places/${placeId}.json`,
          { ...updatedPlaces[updatedPlaceIndex], id: null }
        );
      }),
      tap(() => {
        this._places.next(updatedPlaces);
      })
    );
  }
}
