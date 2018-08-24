import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';

@Component({
  selector: 'app-giving-report-general',
  templateUrl: './giving-report-general.component.html',
  styleUrls: ['./giving-report-general.component.scss']
})
export class GivingReportGeneralComponent implements OnInit, OnDestroy {

  pageTitle = 'Reports-Giving ';
  pageIcon = '';

  navLinks = [
    { path: 'overview', label: 'Overview', icon: 'list' },
    { path: 'individual', label: 'By Individual', icon: 'person' },
    { path: 'anonymous', label: 'By Anonymous', icon: 'device_unknown' },
    { path: 'batches', label: 'Batches', icon: 'category' },
    { path: 'demographics', label: 'Demographics', icon: 'notes' }
  ];

  tabIndex = 'givingGeneralReport';
  parenRoute = 'giving-report';

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    // navigate to profile bio
    this.router.navigate([this.parenRoute, this.navLinks[0].path]);
  }
  
  ngOnDestroy(): void {
    // reset tab index
    localStorage.setItem(this.tabIndex, '0');
  }
 
  onLinkClick(event: MatTabChangeEvent) {
    const tabTitle = event.tab.textLabel;

    const routerLink = this.navLinks.find(n => n.label === tabTitle ).path;

    // saving tab index to storage
    localStorage.setItem(this.tabIndex, event.index.toString());

    this.router.navigate([this.parenRoute, routerLink]);
  }
  
}
