import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PersonAllergy } from '../models/person-allergy.model';

@Injectable({
  providedIn: 'root'
})
export class PersonAllegyService {
  allegyCol: AngularFirestoreCollection<PersonAllergy>;
  allergy: Observable<PersonAllergy[]>;

  constructor(private db: AngularFirestore) {}

  getAllegies(personId: string) {
    this.allegyCol = this.db.collection('allegies', ref => ref.where('personId', '==', personId));

    return this.allergy = this.allegyCol.snapshotChanges().pipe(
      map(change => {
        return change.map(a => {
          const data = a.payload.doc.data() as PersonAllergy;
          data.id = a.payload.doc.id;

          return data;
        });
      }));
  }

  saveAllegy(personId: string, allegy) {
    return this.db.collection(`allegies`).add({
      personId: personId,
      allegy: allegy,
      createdDate: new Date().getTime()
    });
  }

  deleteAllegy(personId: string, allegyId: string) {
    return this.db.doc(`allegies/${allegyId}`).delete();
  }
}



