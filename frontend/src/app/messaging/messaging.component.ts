import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { InternalInteractionService } from '../internal-interaction.service';
import { DataInteractionService } from '../data-interaction.service';
import { Message } from '../message';
import { Router } from '@angular/router';
import { UserProfile } from '../user-profile';
import { CookieService } from 'ngx-cookie-service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css']
})
export class MessagingComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollable') private myScrollContainer : ElementRef;

  messages : Message[];

  messageIsStart : boolean[] = [];
  messageIsMiddle : boolean[] = [];
  messageIsEnd : boolean[] = [];
  needsDateSeparator : boolean[] = [];
  hasAttachmentMessage : boolean[] = [];

  messageText : string = '';
  otherPerson : UserProfile;

  myUsername : string;

  isInquiry : boolean = false;
  inquiryImage : string;


  constructor(private cookieService : CookieService, private db : AngularFirestore, private internalInteractionService : InternalInteractionService, private dataInteractionService : DataInteractionService, private router : Router) { }

  ngAfterViewChecked(){
    try{
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch {}
  }

  ngOnInit(): void {
    this.myUsername = this.cookieService.get('username');

    // get the person we're messaging
    this.otherPerson = this.internalInteractionService.viewingUser;
    if (this.otherPerson == null){
      this.router.navigateByUrl('messages')
    }

    if (this.internalInteractionService.viewingListing != null){
      this.isInquiry = true;
      this.inquiryImage = this.internalInteractionService.viewingListing.imageUrl;
    }

    // get our messages from the database
    // console.log(this.internalInteractionService.viewingUser)
    try {
      this.pullMessages();
      this.updateMessageArrays();
    } catch {
      this.router.navigateByUrl('messages')
    }
    
  }

  pullMessages(){
    this.messages = [];
    var allMessages = [];

    // console.log(this.cookieService.get('userId'), this.cookieService.get('viewingUserId'))

    this.db.collection('messages').ref.orderBy('time', 'desc').get().then(res => {

      res.forEach(message => {
          var userTo = null;
          var userFrom = null;

          this.db.collection('users').ref.where('username', '==', message.data()['userTo']).get().then(res => {
            res.forEach(user => {
              userTo = new UserProfile(user.data()['userId'], user.data()['username'], user.data()['profilePictureUrl'], user.data()['location'], [])
            })
  
            this.db.collection('users').ref.where('username', '==', message.data()['userFrom']).get().then(res => {
              res.forEach(user => {
                userFrom = new UserProfile(user.data()['userId'], user.data()['username'], user.data()['profilePictureUrl'], user.data()['location'], [])
              })

              if ((message.data()['userFrom'] == this.cookieService.get('username') && message.data()['userTo'] == this.cookieService.get('viewingUserId'))
              || (message.data()['userTo'] == this.cookieService.get('username')  && message.data()['userFrom'] == this.cookieService.get('viewingUserId'))){

                this.messages.push(new Message(userTo, userFrom, message.data()['messageBody'], message.data()['time'].toDate(), message.data()['attachmentUrl']))

              }

  
              
            });
          });

      })

      // this.messages = allMessages;
      
      // this.messages = allMessages.sort((b,a) => (a.sentDate - b.sentDate));

    });


  }

  updateMessageArrays(){
    this.messageIsStart = [];
    this.messageIsMiddle = [];
    this.messageIsEnd = [];
    this.needsDateSeparator = [];
    this.hasAttachmentMessage = [];

    if (this.messages == null || this.messages.length == 0){
      return;
    }

    var counter = 0;
    this.messages.forEach(() => {
      if (this.nextMessageIsContinued(counter)){
        this.messageIsStart.push(true);
        this.messageIsMiddle.push(false);
        this.messageIsEnd.push(false);
      } else if (this.isMiddleMessage(counter)){
        this.messageIsStart.push(false);
        this.messageIsMiddle.push(true);
        this.messageIsEnd.push(false);
      } else if (this.isEndMessage(counter)){
        this.messageIsStart.push(false);
        this.messageIsMiddle.push(false);
        this.messageIsEnd.push(true);
      } else {
        this.messageIsStart.push(false);
        this.messageIsMiddle.push(false);
        this.messageIsEnd.push(false);
      }

      if (counter == 0){
        this.needsDateSeparator.push(true)
      } else {
        this.needsDateSeparator.push(this.messages[counter].sentDate.getDay() != this.messages[counter - 1].sentDate.getDay())
      }

      if (this.messages[counter].attachmentUrl.trim() == ''){
        this.hasAttachmentMessage.push(false);
      } else if (this.messagesMatch(counter, counter + 1)){
        this.hasAttachmentMessage.push(true);
      } else {
        this.hasAttachmentMessage.push(false);
      }

      counter++;
    });
  }

  nextMessageIsContinued(thisIndex : number){
    return !this.messagesMatch(thisIndex, thisIndex - 1) && this.messagesMatch(thisIndex, thisIndex + 1)
  }

  isMiddleMessage(thisIndex : number){
    return this.messagesMatch(thisIndex, thisIndex - 1) && this.messagesMatch(thisIndex, thisIndex + 1)
  }

  isEndMessage(thisIndex : number){
    return this.messagesMatch(thisIndex, thisIndex - 1) && !this.messagesMatch(thisIndex, thisIndex + 1)
  }

  messagesMatch(index1 : number, index2 : number){
    try {
      return this.messages[index1].sentDate.getDate() == this.messages[index2].sentDate.getDate()
          && this.messages[index1].sentDate.getHours() == this.messages[index2].sentDate.getHours()
          && this.messages[index1].sentDate.getMinutes() == this.messages[index2].sentDate.getMinutes()
          && this.messages[index1].toUser.username == this.messages[index2].toUser.username;
    } catch {
      return false;
    }
  }

  sendMessage(){
    if (this.messageText.trim() != ''){
      if (this.isInquiry){
        this.sendActualMessage('', this.inquiryImage, this.internalInteractionService.viewingUser);
        this.internalInteractionService.viewingListing = null;
        this.isInquiry = false;
        this.inquiryImage = '';
      }
  
      this.sendActualMessage(this.messageText, '', this.internalInteractionService.viewingUser);
      this.messageText = '';
      this.pullMessages();
      // this.messages = this.dataInteractionService.pullMessages(this.internalInteractionService.viewingUser);

      this.updateMessageArrays();
    }
  }

  sendActualMessage(messageText : string, imageUrl : string, recipient : UserProfile){
    let dbMessage = {
      userFrom : this.cookieService.get('username'),
      userTo : recipient.username,
      time : new Date(),
      messageBody : messageText,
      attachmentUrl : imageUrl
    };

    return new Promise<any>((resolve, reject) => {
      this.db.collection('messages').add(dbMessage).then(res => {}, err => reject(err));
    });
  }

  back(){
    this.internalInteractionService.viewingUser = null;
    
    this.router.navigateByUrl(this.internalInteractionService.lastAt);
  }

}
