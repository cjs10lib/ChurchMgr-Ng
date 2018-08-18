import { Subscription, Observable } from 'rxjs';
import { PersonGivingBatchService } from './../../../../services/person-giving-batch.service';
import { GivingBatch } from './../../../../models/person-giving.model';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialogRef } from '../../../../../../node_modules/@angular/material';
import { SweetAlertService } from '../../../../services/sweet-alert.service';
import { GivingBatchFormComponent } from '../giving-batch-form/giving-batch-form.component';

@Component({
  selector: 'app-giving-batch',
  templateUrl: './giving-batch.component.html',
  styleUrls: ['./giving-batch.component.scss']
})
export class GivingBatchComponent implements OnInit, OnDestroy {

  addBatchSwitch = false;
  givingBatchId: string;

  givingBatches = [];

  displayedColumns: string[] = ['name', 'amount', 'recieved', 'created', 'Id'];
  dataSource: MatTableDataSource<GivingBatch>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  batchServiceSubscription: Subscription;
  addBatchSubscription: Subscription;
  selectBatchSubscription: Subscription;

  constructor(private givingBatchService: PersonGivingBatchService,
    public dialogRef: MatDialogRef<GivingBatchFormComponent>, private sweetAlertService: SweetAlertService) {}

  ngOnInit() {

    this.batchServiceSubscription = this.givingBatchService.getGivingBatches().subscribe(resp => {
      this.givingBatches = resp;

      this.dataSource = new MatTableDataSource(this.givingBatches);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

  }

  ngOnDestroy(): void {
    if (this.batchServiceSubscription) {
      this.batchServiceSubscription.unsubscribe();
    }

    if (this.addBatchSubscription) {
      this.addBatchSubscription.unsubscribe();
    }

    if (this.selectBatchSubscription) {
      this.selectBatchSubscription.unsubscribe();
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addBatch() {
    this.addBatchSwitch = !this.addBatchSwitch;
  }

  onCreateBatch(batchId:  string) {
    this.addBatchSubscription = this.givingBatchService.getGivingBatch(batchId).subscribe(resp => {
      this.dialogRef.close({ batchId: batchId, batch: resp });
    });

    // this.givingBatchId = batchId;
    // this.dialogRef.close({ batchId: batchId });
  }

  onSelectExistingBatch(batchId: string) {
    this.selectBatchSubscription = this.givingBatchService.getGivingBatch(batchId).subscribe(resp => {
      this.dialogRef.close({ batchId: batchId, batch: resp });
    });
  }

}
