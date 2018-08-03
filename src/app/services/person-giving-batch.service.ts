import { GivingBatch } from './../models/person-giving.model';
import { Observable } from 'rxjs';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { map } from '../../../node_modules/rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PersonGivingBatchService {

  private givingBatchCollection: AngularFirestoreCollection<GivingBatch>;
  private givingBatches: Observable<GivingBatch[]>;

  constructor(private db: AngularFirestore) {
    this.givingBatchCollection = db.collection('giving-batch');

    this.givingBatches = this.givingBatchCollection.snapshotChanges().pipe(
      map(change => {
        return change.map(a => {
          const data = a.payload.doc.data() as GivingBatch;
          data.Id = a.payload.doc.id;

          return data;
        });
      })
    );
  }

  getGivingBatches() {
    return this.givingBatches;
  }

  getGivingBatch(batchId: string) {
    return this.db.doc(`giving-batch/${batchId}`).valueChanges();
  }

  addGivingBatch(batch: GivingBatch) {
    batch.created = new Date();
    return this.givingBatchCollection.add(batch);
  }
}
