import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { Subject } from 'rxjs';
import { AngularFireModule } from '@angular/fire';

export class FirebaseStoreService {
  adminValue = new Subject<any>();

  constructor(private db: AngularFireDatabase, private afa: AngularFireAuth) {}

  getAdmin(email: string) {
    // const adminsRef = this.db.list('admins');
    // const admins = this.db.list('admins').snapshotChanges();
    // console.log(adminsRef);
  }
}
