import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PersonAllergy } from '../models/person-allergy.model';

@Injectable({
  providedIn: 'root'
})
export class PersonAllergyService {
  allergyCol: AngularFirestoreCollection<PersonAllergy>;
  allergy: Observable<PersonAllergy[]>;

  constructor(private db: AngularFirestore) {}

  getAllergies(personId: string) {
    this.allergyCol = this.db.collection('allergies', ref => ref.where('personId', '==', personId));

    return this.allergy = this.allergyCol.snapshotChanges().pipe(
      map(change => {
        return change.map(a => {
          const data = a.payload.doc.data() as PersonAllergy;
          data.id = a.payload.doc.id;

          return data;
        });
      }));
  }

  saveAllergy(personId: string, allergy) {
    return this.db.collection(`allergies`).add({
      personId: personId,
      allergy: allergy,
      createdDate: new Date().getTime()
    });
  }

  deleteAllergy(personId: string, allergyId: string) {
    return this.db.doc(`allergies/${allergyId}`).delete();
  }

}




