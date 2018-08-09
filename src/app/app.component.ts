import { AngularFirestore } from 'angularfire2/firestore';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  constructor(private _db: AngularFirestore) {
    // _db.firestore.settings({ timestampsInSnapshots: false });
    // _db.firestore.enablePersistence();
  }
}
