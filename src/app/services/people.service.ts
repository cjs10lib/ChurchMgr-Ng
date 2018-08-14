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
          const data = a.payload.doc.data() as any;
          // const data = Object.assign(a.payload.doc.data(), { date: a.payload.doc.data().dob.toDateString() });
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

  getPerson(personId: string): Observable<Person> {
    return this.db.doc(`people/${personId}`).valueChanges();
  }

  addPerson(person: Person) {
    person.fullname = person.surname + ' ' + person.firstname + ' ' + person.othernames;
    person.lastUpdate = new Date().getTime();

    // generates an Id to save into people and set into gallery
    const profileAvatarId = this.db.createId();
    person.profileImage = profileAvatarId;

    // saves person data
    const personData = this.peopleCollection.add(person);

    return { personData, profileAvatarId };
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
