import { Component, OnInit, Input } from '@angular/core';
import { ListingObject } from '../listing-object';
import { Router } from '@angular/router';
import { InternalInteractionService } from '../internal-interaction.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-listing-preview',
  templateUrl: './listing-preview.component.html',
  styleUrls: ['./listing-preview.component.css']
})
export class ListingPreviewComponent implements OnInit {

  @Input() listingObject : ListingObject;

  constructor(private cookieService : CookieService, private router : Router, private internalInteractionService : InternalInteractionService) { }

  ngOnInit(): void {
  }

  onClicked(){
    this.internalInteractionService.viewingUser = this.listingObject.userProfile;
    this.internalInteractionService.viewingListing = this.listingObject;
    this.internalInteractionService.lastAt = 'likes';
    this.router.navigateByUrl('messaging');
  }

}
