import { Component, OnInit, Input, Renderer2, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { NatriconService } from 'src/app/services/natricon.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-user-picture',
  templateUrl: './user-picture.component.html',
  styleUrls: ['./user-picture.component.scss'],
  host: {
    '[class.m]': 'size === "m"',
    '[class.l]': 'size === "l"'
  }
})
export class UserPictureComponent implements OnInit {

  @Input() url: string;
  @Input() address: string;
  @Input() size = 1;
  private addressSubj$ = new Subject<string>();
  icon$ = this.addressSubj$.pipe(
    switchMap(address => this.natriconSrv.getIcon(this.address))
  );

  constructor(
    private renderer: Renderer2,
    private elRef: ElementRef,
    private natriconSrv: NatriconService
  ) { }

  ngOnInit(): void {
    this.renderer.setStyle(this.elRef.nativeElement, 'height', `${this.size}rem`);
    this.renderer.setStyle(this.elRef.nativeElement, 'width', `${this.size}rem`);
    if (this.address) {
      this.icon$ = this.natriconSrv.getIcon(this.address);
    }
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   const address = changes?.address?.currentValue;
  //   if (changes.address.previousValue !== address) {
  //     this.addressSubj$.next(address);
  //   }
  // }

}
