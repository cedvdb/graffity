import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/components/shared.module';
import { ChatPageComponent } from './chat-page.component';
import { MessageComponent } from './message/message.component';



@NgModule({
  declarations: [ChatPageComponent, MessageComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([ { path: '', component: ChatPageComponent }])
  ]
})
export class ChatPageModule { }
