import { Component, OnInit } from '@angular/core';
import { ListingObject } from '../listing-object';
import { DataInteractionService } from '../data-interaction.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserProfile } from '../user-profile';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  listingObject : ListingObject;
  listingObjectIds : number[];

  constructor(private db : AngularFirestore, private cookieService : CookieService, private dataInteractionService : DataInteractionService) {}

  ngOnInit(): void {
    this.newListing()
  }

  newListing(){
    // select all products not in views
    var tempObjects = [];
    this.listingObjectIds = [];

    this.db.collection('products').ref.get().then(res => {
      res.forEach(object => {

        if (object.data()['owner'] != this.cookieService.get('username')){
          var prof;
          this.db.collection('users').ref.where('userId', '==', object.data()['owner']).get().then(res => {
            res.forEach(profile => {
              prof = new UserProfile(profile.data()['userId'], profile.data()['username'], '', profile.data()['location'], [])
            })
          })
  
          let obj = new ListingObject(object.data()['price'], object.data()['location'], object.data()['name'], object.data()['photoUrl'], prof);
          let productId = object.data()['productId'];
  
          this.db.collection('views').ref.where('username', '==', this.cookieService.get('username')).get().then(res => {
            var beenViewed = false;
            res.forEach(view => {
              if (view.data()['productId'] == productId){
                beenViewed = true;
              }
            });
            if (beenViewed == false){
              tempObjects.push(obj);
              this.listingObjectIds.push(productId)
            }
  
            this.listingObject = tempObjects[0];
  
          });
        }
      });
    });
  }

  hate(){
    console.log(this.cookieService.get('username'))
    let hate = {
      liked : false,
      productId : this.listingObjectIds[0],
      username : this.cookieService.get('username')
    };

    return new Promise<any>((resolve, reject) => {
      this.db.collection('views').add(hate).then(res => {}, err => reject(err));
      this.newListing()
    });
    
  }

  love(){
    let love = {
      liked : true,
      productId : this.listingObjectIds[0],
      username : this.cookieService.get('username')
    };

    return new Promise<any>((resolve, reject) => {
      this.db.collection('views').add(love).then(res => {}, err => reject(err));
      this.newListing()
    });
  }

}
