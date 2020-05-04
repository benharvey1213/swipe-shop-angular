import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../message';
import { Router } from '@angular/router';
import { InternalInteractionService } from '../internal-interaction.service';
import { UserProfile } from '../user-profile';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-message-card',
  templateUrl: './message-card.component.html',
  styleUrls: ['./message-card.component.css']
})
export class MessageCardComponent implements OnInit {

  @Input() message : Message;

  agoTime : String = "2d";
  otherUser : UserProfile;
  thisUser : UserProfile;

  constructor(private cookieService : CookieService, private router : Router, private internalInteractionService : InternalInteractionService) { }

  ngOnInit(): void {
    // determine which of the profiles on the message is the other user, to display their picture
    if (this.cookieService.get('username') == this.message.toUser.username){
      this.otherUser = this.message.fromUser;
      this.thisUser = this.message.toUser;
    } else {
      this.otherUser = this.message.toUser;
      this.thisUser = this.message.fromUser;
    }


    let now = new Date();

    var diff = Math.abs(now.getTime() - this.message.sentDate.getTime());
    var diffMinutes = Math.round((diff /1000) / 60);

    if (diffMinutes >= 60){
      var diffHours = Math.round(diffMinutes / 60);

      if (diffHours >= 24){
        var diffDays = Math.round(diffHours / 24);

        if (diffDays >= 31){
          var diffWeeks = Math.round(diffDays / 7);

          this.agoTime = diffWeeks + "w";

        } else {
          this.agoTime = diffDays + "d";
        }

      } else {
        this.agoTime = diffHours + "h";
      }

    } else {
      this.agoTime = diffMinutes + "m";
    }

  }

  onClick(){
    this.internalInteractionService.viewingUser = this.otherUser;
    this.cookieService.set('viewingUserId', this.otherUser.id.toString());
    this.internalInteractionService.lastAt = 'messages';
    this.router.navigateByUrl('/messaging');
  }

}
