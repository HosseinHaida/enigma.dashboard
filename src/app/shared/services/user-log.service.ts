import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

// Firebase imports
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserLogService {
  connection = 'https://enigma-ng.firebaseio.com/admins.json';
  whoIsAdmin = new Subject<Admin>();
  idToken: string;
  loginStatus = new Subject<string>();
  signupStatus = new Subject<string>();
  adminUid: string;
  sessionTimeout;
  timestamp;

  constructor(private router: Router, private afa: AngularFireAuth, private http: HttpClient) {
  }

  async checkSignedUserStatusAndSignTheUnauthorizedOut() {
    const thisthis = this;
    await this.afa.auth.onAuthStateChanged(function (user) {
      if (user) {
        try {
          if (typeof (localStorage.getItem('uid'))) {
            const message = 'Number uid detected !!'
            throw message;
          }
          const uid = atob(localStorage.getItem('uid'))
          if (user.uid === uid) {
            // User is signed in.
            console.log('Granted !!');
            const admin = {
              displayName: user.displayName,
              email: user.email,
              photoURL: user.photoURL,
              uid: user.uid
            }
            if (localStorage.getItem('isAuthenticated') !== 'true') {
              // window.location.reload();
              localStorage.setItem('isAuthenticated', 'true')
            };
            thisthis.setAdmin(admin);
          } else {
            // Not this user is signed in.
            console.log('Not this user!');
            thisthis.logout(0);
          }
        } catch {
          error => {
            thisthis.logout(0)
          }
        }
      } else {
        // No user is signed in.
        console.log('Not signed in!');
        thisthis.logout(0);
      }
    });
  }

  isAuthenticated() {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'false' || !authStatus) {
      return false;
    } else {
      return true;
    }
  }

  async setUserLog(email: string, password: string) {
    this.loginStatus.next('trying');
    await this.afa.auth
      .signInWithEmailAndPassword(email, password)
      .then(res => {
        this.loginStatus.next('successful');
        this.setAdmin({
          displayName: res.user.displayName,
          email: res.user.email,
          photoURL: res.user.photoURL,
          uid: res.user.uid
        });
        this.router.navigate(['/home/games']);
      })
      .catch(error => {
        this.loginStatus.next('failure');
        console.log('Can\'t log in!!');
      });
  }

  signNewUserUp(newAdmin: {}) {
    this.signupStatus.next('trying');
    return this.http.post('http://localhost:8000/api/admin/new', newAdmin).subscribe(res => {
      this.signupStatus.next('successful');
      this.router.navigate(['/home/games']);
    },
      error => {
        this.signupStatus.next('failure')
      });
    ;
  }

  setAdmin(admin: Admin) {
    this.whoIsAdmin.next(admin);
    this.adminUid = admin.uid;
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('displayName', admin.displayName);
    localStorage.setItem('email', admin.email);
    localStorage.setItem('photoURL', admin.photoURL);
    localStorage.setItem('uid', btoa(admin.uid));
  }

  getAdminUid() {
    return this.adminUid;
  }

  async logout(timeout: number) {
    await this.afa.auth.signOut();
    clearTimeout(this.sessionTimeout);
    const thisthis = this;
    this.sessionTimeout = setTimeout(() => {
      console.log('logout()!');
      thisthis.idToken = null;
      localStorage.setItem('isAuthenticated', 'false');
      localStorage.removeItem('displayName');
      localStorage.removeItem('email');
      localStorage.removeItem('photoURL');
      localStorage.removeItem('uid');
      thisthis.router.navigate(['/login']);
    }, timeout);
  }
}

// interface FirebaseResponse {
//   email: string;
//   refreshToken: string;
//   expiresIn: string;
//   registered: boolean;
// }

// getAdmin(email: string) {
//   const adminsRef = this.db
//     .list('admins', ref => ref.orderByChild('email').equalTo(email))
//     .snapshotChanges()
//     .pipe(
//       map(changes => {
//         return changes.map(c => ({ ...c.payload.val() }));
//       })
//     );
//   adminsRef.subscribe((admin: Admin[]) => {
//     this.whoIsAdmin.next(admin['0']);
//   });
// }

// return this.http
//   .post(
//     'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDQzg-HPGZMTjU2G4ycrSYh2Kv9JNNFBd4',
//     {
//       email: email,
//       password: password,
//       returnSecureToken: true
//     }
//   )
//   .subscribe(
//     (response: FirebaseResponse) => {
//       this.idToken = response.idToken;
//       this.loginStatus.next('successful');
//       // Set auth data in localStorage
//       this.setAuth(response.idToken, response.expiresIn);
//       // Call firebase to get me the admin as a subject
//       this.firebaseStoreService.getAdmin(response.email);
//       // Auto logout in 1 hour
//       const timeout = Number(response.expiresIn) * 1000;
//       this.logout(timeout);
//       // Navigate to home/games if valid creds
//       this.router.navigate(['/home/games']);
//     },
//     error => {
//       this.loginStatus.next('failure');
//       console.log('error logging in!');
//       console.log(error);
//     }
//   );
