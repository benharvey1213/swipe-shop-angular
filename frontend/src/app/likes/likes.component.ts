import { Component, OnInit } from '@angular/core';
import { ListingObject } from '../listing-object';
import { DataInteractionService } from '../data-interaction.service';
import { CookieService } from 'ngx-cookie-service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { UserProfile } from '../user-profile';

@Component({
  selector: 'app-likes',
  templateUrl: './likes.component.html',
  styleUrls: ['./likes.component.css']
})
export class LikesComponent implements OnInit {

  listingObjects : ListingObject[] = [];

  constructor(private router : Router, private cookieService : CookieService, private db : AngularFirestore, private dataInteractionService : DataInteractionService) { }

  ngOnInit(): void {
    this.db.collection('views').ref.where('username', '==', this.cookieService.get('username')).get().then(res => {
      res.forEach(view => {
        if (view.data()['liked'] == true){
          this.db.collection('products').ref.get().then(res => {
            res.forEach(product => {
              if (product.data()['productId'] == view.data()['productId']){
                var listingObj = new ListingObject(product.data()['price'], product.data()['location'], product.data()['name'], product.data()['photoUrl'], null)

                this.db.collection('users').ref.where('username', '==', product.data()['owner']).get().then(res => {
                  res.forEach(profile => {
                    listingObj.userProfile = new UserProfile(profile.data()['userId'], profile.data()['username'], '', '', [])
                  })

                  this.listingObjects.push(listingObj);
                })
              }
            })
          })
        }
      })
    })
  }
}
