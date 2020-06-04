import { Component, OnInit, Input, Renderer2, ElementRef } from '@angular/core';

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

  @Input() url;
  @Input() size = 1;

  constructor(private renderer: Renderer2, private elRef: ElementRef) { }

  ngOnInit(): void {
    this.renderer.setStyle(this.elRef.nativeElement, 'height', `${this.size}rem`);
    this.renderer.setStyle(this.elRef.nativeElement, 'width', `${this.size}rem`);
  }

}
