import { GivingBatchGivingComponent } from './../giving-batch-giving/giving-batch-giving.component';
import { MatDialog } from '@angular/material';
import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { fadeIn, fadeInDown, fadeInRight } from 'ng-animate';
import { Subscription } from 'rxjs';

import { ConvertTimestampService } from '../../../../../services/convert-timestamp.service';
import { PersonGivingCategoryService } from '../../../../../services/person-giving-category.service';
import { PersonGivingService } from '../../../../../services/person-giving.service';
import { GivingBatch } from './../../../../../models/person-giving.model';
import { PersonGivingBatchService } from './../../../../../services/person-giving-batch.service';

@Component({
  selector: 'app-giving-batches',
  templateUrl: './giving-batches.component.html',
  styleUrls: ['./giving-batches.component.scss'],
  animations: [
    trigger('fadeIn', [transition('* => *', useAnimation(fadeIn,{params: { timing: 0.20, delay: 0 }}))]),
    trigger('fadeInDown', [transition('* => *', useAnimation(fadeInDown, {params: { timing: 0.20, delay: 0 }}))]),
    trigger('fadeInRight', [transition('* => *', useAnimation(fadeInRight, {params: { timing: 0.20, delay: 0 }}))]),
  ],
})
export class GivingBatchesComponent implements OnInit {

  fadeIn: any;
  fadeInDown: any;
  fadeInRight: any;

  // search Qry
  searchQry: string;

  givingBatch: GivingBatch[] = [];
  filteredBatch: GivingBatch[] = [];

  showSpinner = true;
  subscription: Subscription;

  constructor(private givingBatchService: PersonGivingBatchService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.subscription = this.givingBatchService.getGivingBatches().subscribe(resp => {
      this.showSpinner = false;

      this.givingBatch = this.filteredBatch = resp;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  } 

  openDialog(batchId: string) {
    this.dialog.open(GivingBatchGivingComponent, {
      height: '800px',
      width: '1000px',
      data: batchId
    });
  }

  search(qry: string) {

    this.filteredBatch = qry ?
    this.givingBatch.filter(
      p => p.name.toLowerCase().includes(qry.toLowerCase())) : this.givingBatch;
  }

  clearSearchField() {
    this.search('');
    this.searchQry = '';   
  }

}
