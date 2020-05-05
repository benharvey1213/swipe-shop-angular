import { Component, OnInit, Input } from '@angular/core';
import { ListingObject } from '../listing-object';
import { DataInteractionService } from '../data-interaction.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-listing-card',
  templateUrl: './listing-card.component.html',
  styleUrls: ['./listing-card.component.css']
})
export class ListingCardComponent implements OnInit {

  @Input() listingObject : ListingObject;

  constructor(private db : AngularFirestore, private dataInteractionService : DataInteractionService, private router : Router) { }

  ngOnInit(): void {
  }

  remove(){
    this.db.collection('products').ref.get().then(res => {
      res.forEach(product => {
        if (product.data()['price'] == this.listingObject.price && product.data()['name'] == this.listingObject.description && product.data()['photoUrl'] == this.listingObject.imageUrl){
          let id = product.id

          this.db.collection('products').doc(id).delete().then(res => {
            this.router.navigateByUrl('');
          });

        }
      })
    });

    
  }

}
