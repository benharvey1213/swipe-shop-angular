import { Injectable } from '@angular/core';
import { ListingObject } from './listing-object';
import { Message } from './message';
import { UserProfile } from './user-profile';
import { InternalInteractionService } from './internal-interaction.service';
import { CookieService } from 'ngx-cookie-service';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})

export class DataInteractionService {

  profiles1 : UserProfile[] = [
    new UserProfile(0, 'terry.crews', 'https://i.imgur.com/Ss75Vfa.jpg', 'Fargo, ND', []),
    new UserProfile(1, 'some.user', 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', 'Fargo, ND', []),
    new UserProfile(2, 'someother.user', 'https://scx1.b-cdn.net/csz/news/800/2015/howwilldatar.jpg', 'Fargo, ND', []),
    new UserProfile(3, 'random.person21', 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSYW0XEqHljEUNvoFfmEEpM7Z4cyq5V66MNrLyXerInvBFM5KUc&usqp=CAU', 'Fargo, ND', []),
    new UserProfile(4, 'kanye.west', 'https://peoplescience.maritz.com/-/media/Maritz/Project/PeopleScience/Articles/adult-grandma-elderly-432722.ashx?h=900&w=1200&la=en&hash=5F66C65B032FEE90B10A489D08EC8B7D0E64B8CE', 'Fargo, ND', []),
    new UserProfile(5, 'kungfu.kenny', 'https://pbs.twimg.com/profile_images/879355674957926400/VSGZHGib_400x400.jpg', 'Fargo, ND', []),
    new UserProfile(6, 'woah.kenny', 'https://i.imgur.com/Ss75Vfa.jpg', 'Fargo, ND', []),
  ]

  // temporary
  listings : ListingObject[] = [
    new ListingObject(3.0, "Fargo", "My stupid cat", "https://i.imgur.com/Ss75Vfa.jpg", this.profiles1[1]),
    new ListingObject(6.0, "Bismarck", "My stupid dogs", "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500", this.profiles1[2]),
    new ListingObject(9.0, "Grand Forks", "My stupid phone", "https://scx1.b-cdn.net/csz/news/800/2015/howwilldatar.jpg", this.profiles1[3]),
    new ListingObject(12.0, "Minneapolis", "My stupid cow Betsy", "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSYW0XEqHljEUNvoFfmEEpM7Z4cyq5V66MNrLyXerInvBFM5KUc&usqp=CAU", this.profiles1[4]),
    new ListingObject(16.50, "Jamestown", "My stupid used car", "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ4B2mpOFXbAnsupjbRiAUambtV6jhyb4lx0sJuZOvp-s-VKjUS&usqp=CAU", this.profiles1[4]),
    new ListingObject(300.0, "Los Angeles", "My stupid grandma", "https://peoplescience.maritz.com/-/media/Maritz/Project/PeopleScience/Articles/adult-grandma-elderly-432722.ashx?h=900&w=1200&la=en&hash=5F66C65B032FEE90B10A489D08EC8B7D0E64B8CE", this.profiles1[5]),
    new ListingObject(34.0, "Germany", "My stupid science teacher", "https://pbs.twimg.com/profile_images/879355674957926400/VSGZHGib_400x400.jpg", this.profiles1[5])
  ]

  // temp
  profiles : UserProfile[] = [
    new UserProfile(0, 'terry.crews', 'https://i.imgur.com/Ss75Vfa.jpg', 'Fargo, ND', this.listings),
    new UserProfile(1, 'some.user', 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', 'Fargo, ND', this.listings),
    new UserProfile(2, 'someother.user', 'https://scx1.b-cdn.net/csz/news/800/2015/howwilldatar.jpg', 'Fargo, ND', this.listings),
    new UserProfile(3, 'random.person21', 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSYW0XEqHljEUNvoFfmEEpM7Z4cyq5V66MNrLyXerInvBFM5KUc&usqp=CAU', 'Fargo, ND', this.listings),
    new UserProfile(4, 'kanye.west', 'https://peoplescience.maritz.com/-/media/Maritz/Project/PeopleScience/Articles/adult-grandma-elderly-432722.ashx?h=900&w=1200&la=en&hash=5F66C65B032FEE90B10A489D08EC8B7D0E64B8CE', 'Fargo, ND', this.listings),
    new UserProfile(5, 'kungfu.kenny', 'https://pbs.twimg.com/profile_images/879355674957926400/VSGZHGib_400x400.jpg', 'Fargo, ND', this.listings),
    new UserProfile(6, 'woah.kenny', 'https://i.imgur.com/Ss75Vfa.jpg', 'Fargo, ND', this.listings),
  ]

  // temp
  messagePreviews : Message[] = [
    new Message(this.profiles[1], this.profiles[0], 'this is simply a test message', new Date('2020-04-23T22:30:00'), ''),
    new Message(this.profiles[2], this.profiles[0], 'this is simply another test message', new Date('2020-04-22T18:30:00'), ''),
    new Message(this.profiles[3], this.profiles[0], 'this is yet another test message', new Date('2020-04-22T18:30:00'), ''),
    new Message(this.profiles[4], this.profiles[0], 'this is yet yetttt another test message', new Date('2020-04-22T18:30:00'), ''),
    new Message(this.profiles[5], this.profiles[0], 'this is a stupid test message', new Date('2020-04-22T18:30:00'), ''),
    new Message(this.profiles[6], this.profiles[0], 'this is a smart test message', new Date('2020-04-20T18:30:00'), ''),
  ];

  messagesFromOneUser : Message[] = [
    new Message(this.profiles[0], this.profiles[1], 'Hey Terry!', new Date('2020-04-20T18:30:00'), ''),
    new Message(this.profiles[0], this.profiles[1], 'How are you doing?', new Date('2020-04-20T18:30:00'), ''),
    new Message(this.profiles[0], this.profiles[1], 'Made any good sales lately?', new Date('2020-04-20T18:40:00'), ''),
    new Message(this.profiles[1], this.profiles[0], 'No, not really, you?', new Date('2020-04-20T18:32:00'), ''),
    new Message(this.profiles[0], this.profiles[1], 'Your mom is a bitch', new Date('2020-04-21T18:33:00'), ''),
    new Message(this.profiles[1], this.profiles[0], 'Hey listen here fuckface', new Date('2020-04-21T18:34:00'), ''),
    new Message(this.profiles[1], this.profiles[0], 'I\'d fuck you up in a fight so bad', new Date('2020-04-21T18:34:00'), ''),
    new Message(this.profiles[1], this.profiles[0], 'Your mom is the fucking bitch', new Date('2020-04-21T18:34:00'), ''),
    new Message(this.profiles[0], this.profiles[1], 'Sorry that was my little brother', new Date('2020-04-23T18:38:00'), ''),
    new Message(this.profiles[0], this.profiles[1], 'My bad', new Date('2020-04-23T18:38:00'), ''),
    new Message(this.profiles[0], this.profiles[1], '', new Date('2020-04-24T18:38:00'), 'https://i.imgur.com/kLNuaHs.jpg'),
    new Message(this.profiles[1], this.profiles[0], '', new Date('2020-04-24T18:38:00'), 'https://i.imgur.com/kLNuaHs.jpg'),
  ]

  constructor(private internalInteractionService : InternalInteractionService, private cookieService : CookieService, private db : AngularFirestore) {
        
    // temp
    let profile : UserProfile = this.profiles[0];
    this.internalInteractionService.currentUser = profile;
  }


  login(username : string, password : string){

    
    // return a profile object

    
    // set internal interaction service to this user profile

    //temp
    let profile : UserProfile = this.profiles[0];
    this.internalInteractionService.currentUser = profile;

    return profile.id;

    // return -1 if failed login
  }

  signUp(username : string, password : string){
    // https://stackoverflow.com/questions/41272734/returning-promise-after-firebase-query

    // check if a user with this name exists
    
    this.db.collection<any>('users').ref.where('username', '==', 'ben.harvey')
    .get()
    .then(res => {
      if (res.docs.length == 0){
        // no user with that name

        // get the next user id

        var maxId = 0;

        this.db.collection<any>('users').ref.get().then(res => {
          res.forEach(user => {
            if (user.data()['userId'] > maxId){
              maxId = user.data()['userId'];
            }
          })
          console.log(maxId)
        });

        


      } else {
        res.forEach(user => {
          console.log(user.id);
          console.log(user.data())
        })
      }
    })

    // var userExists = false;
    // this.db.collection('users').snapshotChanges().subscribe(res => {
    //   res.forEach((user) => {
    //     if (user.payload.doc.data()['username'] == username){
    //       userExists = true;
    //     }
    //   });
    // });

    // if (userExists){
    //   return -1;
    // }

    return 1;

    // return new Promise<any>((resolve, reject) => {
    //   this.db.collection('messages').add(dbMessage).then(res => {}, err => reject(err));
    // });


  }


  pullNewListing(){
    // pull a listing from the database where not in hates or likes


    // parse the data into an ListingObject

    
    // return the ListingObject


    // temporary
    return this.listings[Math.floor(Math.random() * this.listings.length)]  
  }

  hateItem(object : ListingObject){
    // tell the database not to show us this item again


  }
  
  loveItem(object : ListingObject){
    // tell the database we love this item


  }

  pullMessagePreviews(){
    // query the database for the latest message from each person (descending order), also include their picture url

    // temp
    return this.messagePreviews;
  }


  pullLikes(){
    // query the database for all items I've liked

    // temp
    return this.listings;
  }


  pullMessages(profile : UserProfile){
    // return an array of Message objects

    // temp
    if (profile.id == 1){
      return this.messagesFromOneUser;
    } else {
      return [];
    }
  }

  sendMessage(messageText : string, imageUrl : string, recipient : UserProfile){
    let dbMessage = {
      userFrom : this.internalInteractionService.currentUser.username,
      userTo : recipient.username,
      time : new Date(),
      messageBody : messageText,
      attachmentUrl : imageUrl
    };

    return new Promise<any>((resolve, reject) => {
      this.db.collection('messages').add(dbMessage).then(res => {}, err => reject(err));
    });

    // temp
    // this.messagesFromOneUser.push(new Message(recipient, this.internalInteractionService.currentUser, messageText, new Date(), imageUrl));
  }

  pullProfile(id : number){
    // query database for user with this ID, and return a UserProfile object


    // temp
    return this.internalInteractionService.currentUser;

  }

  removeListing(object : ListingObject){
    // remove from database

    // temp
    this.listings.splice(this.listings.indexOf(object), 1);
  }

  addListing(imageUrl : string, name : string, price : number){
    let curUser = this.internalInteractionService.currentUser;
    this.listings.push(new ListingObject(price, curUser.location, name, imageUrl, curUser));
  }


}
