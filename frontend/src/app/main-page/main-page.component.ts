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

  constructor(private db : AngularFirestore, private cookieService : CookieService, private dataInteractionService : DataInteractionService) {}

  ngOnInit(): void {
    this.newListing()
  }

  newListing(){
    // select all products not in views
    var tempObjects = [];

    this.db.collection('products').ref.get().then(res => {
      res.forEach(object => {

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
          }

          this.listingObject = tempObjects[6];

        });

      });

    });

  }

  hate(){
    this.dataInteractionService.hateItem(this.listingObject)
    this.newListing()
  }

  love(){
    this.dataInteractionService.loveItem(this.listingObject)
    this.newListing()
  }

}
