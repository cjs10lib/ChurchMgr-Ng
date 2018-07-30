import { PersonFamily } from '../models/person-family.model';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { Family } from '../models/person-family.model';
import { Person } from '../models/person.model';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PersonFamilyService {
  private familyCol: AngularFirestoreCollection<Family>;
  private families: Observable<Family[]>;

  constructor(private db: AngularFirestore) {
    this.familyCol = db.collection('families', ref => ref.orderBy('name'));

    this.families = this.familyCol.snapshotChanges().pipe(
      map(change => {
        return change.map(a => {
          const data = a.payload.doc.data() as Family;
          data.id = a.payload.doc.id;

          return data;
        });
      }));
  }

  getPersonFamily(personId: string) {
    return this.db.doc(`people-family/${personId}`).valueChanges();
  }

  getFamilyMembers(familyId: string): Observable<PersonFamily[]> {
    return this.db.collection('people-family', ref => ref.where('familyId', '==', familyId)).valueChanges();
  }

  getFamilies() {
    return this.families;
  }

  addFamily(family: Family) {
    family.lastUpdate = new Date().getTime();
    return this.db.collection('families').add(family);
  }

  updatePersonFamily(personId: string, family: PersonFamily) {
    family.personId = personId;
    family.lastUpdate = new Date().getTime();
    return this.db.collection('people-family').doc(personId).set(family);
  }
}
