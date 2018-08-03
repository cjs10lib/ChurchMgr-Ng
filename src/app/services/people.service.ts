import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Person } from '../models/person.model';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {

  private peopleCollection: AngularFirestoreCollection<Person>;
  private people$: Observable<Person[]>;

  constructor(private db: AngularFirestore) {
    this.peopleCollection = db.collection('people');

    this.people$ = this.peopleCollection.snapshotChanges().pipe(
      map(change => {
        return change.map(a => {
          const data = a.payload.doc.data() as Person;
          data.id = a.payload.doc.id;

          // const datePipe = new DatePipe('en-US');
          // const myFormattedDate = datePipe.transform(a.payload.doc.data().dob, 'MM, dd, yyyy');

          // data.dob = + myFormattedDate;

          return data;
        });
      }));
  }

  getPeople() {
    return this.people$;
  }

  getPerson(personId: string) {
    return this.db.doc(`people/${personId}`).valueChanges();
  }

  addPerson(person: Person) {
    person.fullname = person.surname + ' ' + person.firstname + ' ' + person.othernames;
    person.lastUpdate = new Date().getTime();
    return this.peopleCollection.add(person);
  }

  updatePerson(personId: string, person: Person) {
    person.fullname = person.surname + ' ' + person.firstname + ' ' + person.othernames;
    person.lastUpdate = new Date().getTime();
    return this.db.doc(`people/${personId}`).update(person);
  }

  deletePerson(personId: string) {
    return this.db.doc(`people/${personId}`).delete();
  }
}
