import { Subscription } from 'rxjs';
import { Visitor } from './../../../../models/person-visitor.model';
import { PeopleVisitorService } from './../../../../services/people-visitor.service';
import { MatDialog } from '@angular/material';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { VisitorsFormComponent } from '../visitors-form/visitors-form.component';

@Component({
  selector: 'app-visitors-registry',
  templateUrl: './visitors-registry.component.html',
  styleUrls: ['./visitors-registry.component.scss']
})
export class VisitorsRegistryComponent implements OnInit, OnDestroy {

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

      console.log(resp);

      this.showSpinner = false;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
