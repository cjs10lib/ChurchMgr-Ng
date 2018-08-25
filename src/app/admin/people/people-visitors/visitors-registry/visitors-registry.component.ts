import { trigger, transition, useAnimation } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';

import { VisitorsFormComponent } from '../visitors-form/visitors-form.component';
import { Visitor } from './../../../../models/person-visitor.model';
import { PeopleVisitorService } from './../../../../services/people-visitor.service';
import { fadeIn, fadeInDown, fadeInRight } from 'ng-animate';

@Component({
  selector: 'app-visitors-registry',
  templateUrl: './visitors-registry.component.html',
  styleUrls: ['./visitors-registry.component.scss'],
  animations: [
    trigger('fadeIn', [transition('* => *', useAnimation(fadeIn))]),
    trigger('fadeInDown', [transition('* => *', useAnimation(fadeInDown, {params: { timing: 0.25, delay: 0 }}))]),
    trigger('fadeInRight', [transition('* => *', useAnimation(fadeInRight, {params: { timing: 0.75, delay: 0 }}))]),
  ],
})
export class VisitorsRegistryComponent implements OnInit, OnDestroy {

  fadeIn: any;
  fadeInDown: any;
  fadeInRight: any;

  pageTitle = 'Visitors';
  pageIcon = '';

  searchQry: string;

  visitors$: Visitor[];
  filteredVisitors$: Visitor[];

  showSpinner = true;
  subscription: Subscription;

  constructor(private dialog: MatDialog, private visitorService: PeopleVisitorService) { }

  ngOnInit() {
    this.subscription = this.visitorService.getVisitors().subscribe(resp => {
      this.visitors$ = this.filteredVisitors$ = resp;

      this.showSpinner = false;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
    this.subscription.unsubscribe();
    }
  }

  openDialog() {
    this.dialog.open(VisitorsFormComponent, {
      height: '800px',
      width: '1000px',
    }).afterClosed().subscribe(resp => {
      if (resp) {
        console.log(resp);
      }
    });
  }

  search(qry: string) {

    this.filteredVisitors$ = qry ?
    this.visitors$.filter(
      p => p.fullname.toLowerCase().includes(qry.toLowerCase())) : this.visitors$;
  }

  clearSearchField() {
    this.search('');
    this.searchQry = '';
  }

}
