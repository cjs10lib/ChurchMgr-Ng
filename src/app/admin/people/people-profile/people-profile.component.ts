import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

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
  parentUrl: string;
  selectedTab: string;

  tabIndex = 'profileTabIndex';

  subscription: Subscription;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.subscription = this.route.paramMap.subscribe(params => {
      const personId = params.get('id');

      this.parentUrl = `people-profile/${personId}`;
    });

    this.getSourceLoaded();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

  getSourceLoaded() {
    const url = this.router.url;

    if (url.includes('/profile-bio')) {
      // reset tab index
      localStorage.setItem(this.tabIndex, '0');
      this.selectedTab = this.tabIndexFromStorage;

      return;
    }

    // else
    const navIndex = this.navLinks.findIndex(nav => url.includes(nav.path));
    localStorage.setItem(this.tabIndex, navIndex.toString());
    this.selectedTab = this.tabIndexFromStorage;
  }

  onLinkClick(event: MatTabChangeEvent) {
    const tabTitle = event.tab.textLabel;

    const routerLink = this.navLinks.find(n => n.label === tabTitle ).path;

    // saving tab index to storage
    localStorage.setItem(this.tabIndex, event.index.toString());

    this.router.navigate([this.parentUrl, routerLink]);
  }

  get tabIndexFromStorage() {
    return localStorage.getItem(this.tabIndex);
  }

}
