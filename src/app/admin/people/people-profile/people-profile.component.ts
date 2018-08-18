import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Person } from '../../../models/person.model';
import { PeopleService } from '../../../services/people.service';
import { UploadService } from './../../../services/upload.service';
import { MatTabChangeEvent } from '../../../../../node_modules/@angular/material';

@Component({
  selector: 'app-people-profile',
  templateUrl: './people-profile.component.html',
  styleUrls: ['./people-profile.component.scss']
})
export class PeopleProfileComponent implements OnInit, OnDestroy {

  navLinks = [
    { path: 'profile-bio', label: 'Bio Information', icon: 'person' },
    { path: 'profile-Edit', label: 'Edit', icon: 'border_color' },
    { path: 'profile-gallery', label: 'Gallery', icon: 'photo_size_select_actual' },
    { path: 'family-members', label: 'Family', icon: 'people' },
    { path: 'profile-attendance', label: 'Attendance', icon: 'date_range' },
    { path: 'profile-giving', label: 'Giving', icon: 'monetization_on' },
    { path: 'profile-account', label: 'Account', icon: 'account_circle' },
  ];

  personId: string;
  selectedTab: string;

  tabIndex = 'profileTabIndex';

  subscription: Subscription;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.personId = this.route.snapshot.paramMap.get('id');

    // get tab index from storage
    this.selectedTab = this.tabIndexFromStorage;
  }

  ngOnDestroy() {
   // reset tab index
  //  localStorage.setItem(this.tabIndex, '0');
  }

  onLinkClick(event: MatTabChangeEvent) {
    const tabTitle = event.tab.textLabel;

    const routerLink = this.navLinks.find(n => n.label === tabTitle ).path;

    // saving tab index to storage
    localStorage.setItem(this.tabIndex, event.index.toString());
    const parentUrl = `people-profile/${this.personId}`;

    this.router.navigate([parentUrl, routerLink]);
  }

  get tabIndexFromStorage() {
    return localStorage.getItem(this.tabIndex);
  }

}
