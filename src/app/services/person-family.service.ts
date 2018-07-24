import { PersonFamily } from '../models/person-family.model';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { Family } from '../models/person-family.model';
import { Person } from '../models/person.model';
import { map } from 'rxjs/operators';

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

  getFamilyMembers(familyId: string) {
    return this.db.collection('people', ref => ref.where('family.familyId', '==', familyId))
      .snapshotChanges().pipe(map(change => {
        return change.map(a => {
          const data = a.payload.doc.data() as Person;
          data.id = a.payload.doc.id;

          return data;
        });
      }));
  }

  getFamilies() {
    return this.families;
  }

  getPersonFamily(personId: string) {
    return this.db.doc(`people-family/${personId}`).valueChanges();
  }

  addFamily(family: Family) {
    family.lastUpdate = new Date().getTime();
    return this.db.collection('families').add(family);
  }

  updatePersonFamily(personId: string, family: PersonFamily) {
    family.lastUpdate = new Date().getTime();
    return this.db.collection('people-family').doc(personId).set(family);
  }
}
