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

  getUserCoordinates() {
    navigator.geolocation.getCurrentPosition(
      (location: Position) => {
        const coords = { lat: location.coords.latitude, long: location.coords.longitude };
        this.userCoordinates$.next(coords);
        this.userCoordinates = coords;
      },
      () => {
        this.userCoordinates$.next(this.newYorkCoords);
        this.userCoordinates = this.newYorkCoords;
      }
    );
  }
}
