import { Person } from './../models/person.model';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { map } from '../../../node_modules/rxjs/operators';

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

          return data;
        });
      }));
  }

  getPeople() {
    return this.people$;
  }

  addPerson(person: Person) {
    return this.peopleCollection.add(person);
  }
}
