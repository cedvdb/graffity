import { Component, OnInit, Input, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { Message } from 'shared/collections';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageComponent implements OnInit {
  @Input() message: Message;
  @Input() currentUserId: string;
  @Output() userClick = new EventEmitter<string>();
  private colors = ['var(--color-primary)', '#e06860', '#6d7cd4' , '#ef749e', '#a47def'];
  color = this.colors[0];

  mine = false;

  constructor() { }

  ngOnInit(): void {
    if (this.message.createdBy.uid === this.currentUserId) {
      this.mine = true;
    }
    this.computeColor();
  }

  computeColor() {
    const address = this.message?.createdBy?.nanoAddress;
    if (address) {
      this.color = this.colors[address.codePointAt(17) % 6];
    }
  }

}
