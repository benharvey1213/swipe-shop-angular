import { Component, OnInit } from '@angular/core';
import { DataInteractionService } from '../data-interaction.service';
import { Message } from '../message';
import { AngularFirestore } from '@angular/fire/firestore';
import { CookieService } from 'ngx-cookie-service';
import { UserProfile } from '../user-profile';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  messagePreviews : Message[] = [];

  constructor(private db : AngularFirestore, private cookieService : CookieService, private dataInteractionService : DataInteractionService) { }

  ngOnInit(): void {
    var allMessages : Message[] = [];

    this.db.collection<any>('messages').ref.get().then(res => {
      res.forEach(message => {

        if (message.data()['userFrom'] == this.cookieService.get('username') || message.data()['userTo'] == this.cookieService.get('username')){
          var userTo = null;
          var userFrom = null;

          this.db.collection<any>('users').ref.where('username', '==', message.data()['userTo']).get().then(res => {
            res.forEach(user => {
              userTo = new UserProfile(user.data()['userId'], user.data()['username'], user.data()['profilePictureUrl'], user.data()['location'], [])
            })
  
            this.db.collection<any>('users').ref.where('username', '==', message.data()['userFrom']).get().then(res => {
              res.forEach(user => {
                userFrom = new UserProfile(user.data()['userId'], user.data()['username'], user.data()['profilePictureUrl'], user.data()['location'], [])
              })
  
              allMessages.push(new Message(userTo, userFrom, message.data()['messageBody'], message.data()['time'].toDate(), message.data()['attachmentUrl']))
            });
          });
        }
      })
    });
        
    // now filter down to what we want?

    // allMessages = 

    let sortedMessages = allMessages.sort((a,b) => a.sentDate.getTime() - b.sentDate.getTime());

    console.log(sortedMessages)

    this.messagePreviews = sortedMessages;


  }

}
