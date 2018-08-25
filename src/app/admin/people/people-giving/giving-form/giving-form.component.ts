import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { fadeIn, fadeInLeft, fadeInRight } from 'ng-animate';

import { GivingBatchComponent } from './../giving-batch/giving-batch.component';

@Component({
  selector: 'app-giving-form',
  templateUrl: './giving-form.component.html',
  styleUrls: ['./giving-form.component.scss'],
  animations: [
    trigger('fadeInLeft', [transition('* => *', useAnimation(fadeInLeft, {params: { timing: 0.25, delay: 0 }}))]),
  ],
})
export class GivingFormComponent implements OnInit {

  fadeInLeft: any;

  pageTitle = 'Giving';
  pageIcon = '';

  personId: string;

  givingBatch = {};
  showGivingBatch = false;

  constructor(private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit() {
    // dialog data from parent holding person's Id
    if (this.data.length > 0) {
      this.personId = this.data;
    }
  }

  openDialog() {
    this.dialog.open(GivingBatchComponent, {
      height: '800px',
      width: '1000px',
    }).afterClosed().subscribe(resp => {
      if (resp) {

        this.givingBatch = resp;

        this.showGivingBatch = true; // if batch is generated, show it
      }
    });
  }

  clearBatch() {
    this.givingBatch = {};
    this.showGivingBatch = false;
  }

}
