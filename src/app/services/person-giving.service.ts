import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { Giving } from '../models/person-giving.model';
// import firebase = require('../../../node_modules/firebase');
import { ConvertTimestampService } from '../custom-functions/convert-timestamp.service';


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

  getGivings() {
    return this.givings;
  }

  addGiving(giving: Giving) {
    giving.updatedAt = this.timestampService.getTimestamp; // sets server timestamp
    giving.qryGivingDate = this.timestampService.dateToTimestamp(giving.givingDate); // converted giving date to timestamp for easy querying

    return this.givingCollection.add(giving);
  }


  // generateQryId() {


  //   const date = this.timestampService.timestampToDate(timestamp);
  //   return console.log(date.getDay);
  // }
}
