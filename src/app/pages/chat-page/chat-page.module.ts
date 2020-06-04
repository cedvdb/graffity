import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatPageComponent } from './chat-page.component';
import { RouterModule } from '@angular/router';
import { MessageComponent } from './message/message.component';
import { SharedModule } from 'src/app/components/shared.module';



@NgModule({
  declarations: [ChatPageComponent, MessageComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([ { path: '', component: ChatPageComponent }])
  ]
})
export class ChatPageModule { }
