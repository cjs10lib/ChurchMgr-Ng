import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Giving } from './../models/person-giving.model';
import { ConvertTimestampService } from './convert-timestamp.service';


@Injectable({
  providedIn: 'root'
})
export class PersonGivingService {

  private givingCollection: AngularFirestoreCollection<Giving>;
  private givings: Observable<Giving[]>;

  constructor(private db: AngularFirestore, private timestampService: ConvertTimestampService) {
    this.givingCollection = db.collection('giving');

    this.givings = this.givingCollection.snapshotChanges().pipe(
      map(change => {
        return change.map(a => {
          const data = a.payload.doc.data() as Giving;
          data.Id = a.payload.doc.id;

          return data;
        });
      })
    );
  }

  getGivingByDate(givingDate) {
    return this.db.collection('giving', ref => ref.where('qryGivingDate', '==', givingDate))
      .snapshotChanges().pipe(
      map(change => {
        return change.map(a => {
          const data = a.payload.doc.data() as Giving;
          data.Id = a.payload.doc.id;

          return data;
        });
      })
    );
  }

  getGivingById(givingId: string) {
    return this.db.doc(`giving/${givingId}`).valueChanges();
  }

  getGivings() {
    return this.givings;
  }

  addGiving(giving: Giving) {
    giving.updatedAt = this.timestampService.getTimestamp; // sets server timestamp
    giving.qryGivingDate = this.timestampService.dateToTimestamp(giving.givingDate); // converted giving date to timestamp for easy querying

    return this.givingCollection.add(giving);
  }

  updateGiving(givingId: string, giving: Giving) {
    giving.updatedAt = this.timestampService.getTimestamp; // sets server timestamp

    return this.db.doc(`giving/${givingId}`).set({
      data: giving.data, updatedAt: giving.updatedAt
    }, {merge: true});
  }

  deleteGiving(givingId: string) {
    return this.db.doc(`giving/${givingId}`).delete();
  }
}
