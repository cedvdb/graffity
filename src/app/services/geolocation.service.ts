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
  userCoordinates: Coordinates;
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
        this.hasLocation = true;
        this.userCoordinates$.next(coords);
      },
      () => {
        this.snackBar.open(
          'Could not access geolocation, putting you in the global room',
          'ok',
          { duration: 3000 }
        );
      }
    );
  }
}
