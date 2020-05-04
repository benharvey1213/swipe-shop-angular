import { Component, OnInit } from '@angular/core';
import { DataInteractionService } from '../data-interaction.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-new-listing',
  templateUrl: './new-listing.component.html',
  styleUrls: ['./new-listing.component.css']
})
export class NewListingComponent implements OnInit {

  imageUrl : string;
  name : string;
  price : number;

  constructor(private db : AngularFirestore, private cookieService : CookieService, private dataInteractionService : DataInteractionService, private router : Router) { }

  ngOnInit(): void {
  }

  submit(){
    if (this.imageUrl != '' && this.name != '' && this.price != null){
      // this.dataInteractionService.addListing(this.imageUrl, this.name, this.price);

      let product = {
        name : this.name,
        price : this.price,
        photoUrl : this.imageUrl,
        owner : this.cookieService.get('username'),
        location : this.cookieService.get('location'),
      };

      return new Promise<any>((resolve, reject) => {
        this.db.collection('products').add(product).then(res => {
          this.router.navigateByUrl('profile')
        }, err => reject(err));
      });


 



      this.router.navigateByUrl('profile');
    }
  }

}
