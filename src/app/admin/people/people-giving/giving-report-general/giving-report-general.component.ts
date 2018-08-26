import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';

@Component({
  selector: 'app-giving-report-general',
  templateUrl: './giving-report-general.component.html',
  styleUrls: ['./giving-report-general.component.scss']
})
export class GivingReportGeneralComponent implements OnInit {

  pageTitle = 'Reports-Giving ';
  pageIcon = '';

  navLinks = [
    { path: 'overview', label: 'Overview', icon: 'list' },
    { path: 'individual', label: 'By Individual', icon: 'person' },
    { path: 'anonymous', label: 'By Anonymous', icon: 'device_unknown' },
    { path: 'general', label: 'General', icon: 'style' },
    { path: 'batches', label: 'Batches', icon: 'view_compact' },
    { path: 'demographics', label: 'Demographics', icon: 'notes' }
  ];

  selectedTab: string;
  tabIndex = 'givingGeneralReport';
  parenRoute = 'giving-report';

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.getSourceLoaded();
  }
  
  getSourceLoaded() {
    const url = this.router.url;

    if (url.includes('/overview')) {
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

    this.router.navigate([this.parenRoute, routerLink]);
  }

  get tabIndexFromStorage() {
    return localStorage.getItem(this.tabIndex);
  }
  
}
