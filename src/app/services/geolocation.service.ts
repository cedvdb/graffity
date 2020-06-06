import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';


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
  hasLocation = false;

  constructor(private snackBar: MatSnackBar) {}

  getUserCoordinates() {
    navigator.geolocation.getCurrentPosition(
      (location: Position) => {
        // quick fix we cut to two decimal places to have not too much movement
        const lat = parseFloat(location.coords.latitude.toFixed(2));
        const long = parseFloat(location.coords.longitude.toFixed(2));
        const coords = { lat, long };
        if (lat === this.userCoordinates?.lat && long === this.userCoordinates?.long) {
          // user didn't move far enough
          return;
        }
        this.userCoordinates = coords;
        this.userIsAt = 'LOC';
        this.hasLocation = true;
        this.userCoordinates$.next(coords);
      },
      () => {
        this.snackBar.open(
          'Could not access geolocation, location set to New York',
          'ok',
          { duration: 3000 }
        );
        this.userCoordinates = this.newYorkCoords;
        this.userIsAt = 'NY';
        this.hasLocation = false;
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
