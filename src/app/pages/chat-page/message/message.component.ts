import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'shared/collections';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],

})
export class MessageComponent implements OnInit {
  @Input() message: Message;
  @Input() currentUserId: string;
  mine = false;
  constructor() { }

  ngOnInit(): void {
    if (this.message.createdBy.uid === this.currentUserId) {
      this.mine = true;
    }
  }

}