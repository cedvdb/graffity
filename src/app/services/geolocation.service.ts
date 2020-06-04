import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';


export interface Coordinates {
  long: number;
  lat: number;
}

@Injectable({ providedIn: 'root' })
export class GeolocationService {
  userCoordinates$ = new ReplaySubject<Coordinates>(1);
  private newYorkCoords = { lat: 40.730610, long: 73.935242 };

  getUserCoordinates() {
    navigator.geolocation.getCurrentPosition(
      (location: Position) => this.userCoordinates$.next({ lat: location.coords.latitude, long: location.coords.longitude }),
      () => this.userCoordinates$.next(this.newYorkCoords)
    );
  }
}
