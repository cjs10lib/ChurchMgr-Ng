import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import { Giving } from '../models/person-giving.model';

@Injectable({
  providedIn: 'root'
})
export class PersonGivingService {

  private givingCollection: AngularFirestoreCollection<Giving>;
  private givings: Observable<Giving[]>;

  constructor(private db: AngularFirestore) {
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

  getGivings() {
    return this.givings;
  }

  addGiving(giving: Giving) {
    return this.givingCollection.add(giving);
  }
}
