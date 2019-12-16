import { Router } from '@angular/router';
import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';

// Firebase imports
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserLogService {
  connection = 'https://enigma-ng.firebaseio.com/admins.json';
  whoIsAdmin = new Subject<Admin>();
  loginStatus = new Subject<string>();
  signupStatus = new Subject<string>();
  adminUid: string;

  constructor(private router: Router, private afa: AngularFireAuth, private http: HttpClient, private ngZone: NgZone) {
  }

  checkSignedUserStatusAndSignTheUnauthorizedOut() {
    const thisthis = this;
    this.afa.auth.onAuthStateChanged(user => {
      // First check if a user is logged in serverside
      if (!user) {
        thisthis.clearLocalStorage();
        thisthis.ngZone.run(() => thisthis.router.navigate(['/login']));
        return
      }
      try {
        if (typeof (localStorage.getItem('uid')) !== 'string') {
          throw 'No valid uid detected !!';
        }
        const uid = atob(localStorage.getItem('uid'))
        if (user.uid === uid) {
          console.log('Granted !!');
          const admin = {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            uid: user.uid
          }
          const isAuthenticated = localStorage.getItem('isAuthenticated')
          thisthis.setAdmin(admin);
          if (isAuthenticated !== 'true') {
            window.location.reload();
          };
        } else {
          console.log('Not this user!');
          thisthis.logout(true);
          return
        }
      } catch {
        error => {
          console.log(error)
          thisthis.logout(false)
        }
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

  async logout(reload: boolean) {
    await this.afa.auth.signOut();
    console.log('logout !!');
    this.clearLocalStorage();
    this.router.navigate(['/login']);
    if (reload === true) {
      window.location.reload()
    }
  }

  clearLocalStorage() {
    localStorage.setItem('isAuthenticated', 'false');
    localStorage.removeItem('displayName');
    localStorage.removeItem('email');
    localStorage.removeItem('photoURL');
    localStorage.removeItem('uid');
  }
}
