import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';


export interface Coordinates {
  long: number;
  lat: number;
}

@Injectable({ providedIn: 'root' })
export class GeolocationService {
  userCoordinates$ = new ReplaySubject<Coordinates>(1);
  newYorkCoords = { lat: 40.730610, long: 73.935242 };
  userCoordinates: Coordinates;
  // this is just temporary, until we can select a location
  userIsAt: 'NY' | 'LOC' = 'NY';

  getUserCoordinates() {
    navigator.geolocation.getCurrentPosition(
      (location: Position) => {
        const coords = { lat: location.coords.latitude, long: location.coords.longitude };
        this.userCoordinates = coords;
        this.userIsAt = 'LOC';
        this.userCoordinates$.next(coords);
      },
      () => {
        this.userCoordinates = this.newYorkCoords;
        this.userIsAt = 'NY';
        this.userCoordinates$.next(this.newYorkCoords);
      }
    );
  }

  goToNewYork() {
    if (this.userIsAt !== 'NY') {
      this.userIsAt = 'NY';
      this.userCoordinates$.next(this.newYorkCoords);
    }
  }

  goToMyLocation() {
    if (this.userIsAt !== 'LOC') {
      this.userIsAt = 'LOC';
      this.userCoordinates$.next(this.userCoordinates);
    }
  }
}
