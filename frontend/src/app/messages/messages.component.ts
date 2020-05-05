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


    this.db.collection('messages').ref.orderBy('time', 'desc').get().then(res => {
      res.forEach(message => {
        var toUser;
        this.db.collection('users').ref.where('username', '==', message.data()['userTo']).get().then(res => {
          res.forEach(user => {
            toUser = new UserProfile(user.data()['userId'], user.data()['username'], user.data()['profilePictureUrl'], '', [])
          });

          var fromUser;
          this.db.collection('users').ref.where('username', '==', message.data()['userFrom']).get().then(res => {
            res.forEach(user => {
              fromUser = new UserProfile(user.data()['userId'], user.data()['username'], user.data()['profilePictureUrl'], '', [])
            });

            if (toUser.username == this.cookieService.get('username') || fromUser.username == this.cookieService.get('username')){
              let m = new Message(toUser, fromUser, message.data()['messageBody'], message.data()['time'].toDate(), '');

              allMessages.push(m);

              var individualMessages = [];

              allMessages.forEach((message) => {
                var userInIndividual = false;
                individualMessages.forEach((m) => {
                  if ((message.toUser.id == m.toUser.id && message.fromUser.id == m.fromUser.id) || (message.toUser.id == m.fromUser.id && message.fromUser.id == m.toUser.id)){
                    userInIndividual = true;
                  }
                })

                if (!userInIndividual){
                  individualMessages.push(message);
                }
              })

              this.messagePreviews = individualMessages.sort((b,a) => a.sentDate - b.sentDate);

            }

          });

        });

      });
      
    });

  }

}
