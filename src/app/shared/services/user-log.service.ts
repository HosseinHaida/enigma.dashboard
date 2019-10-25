import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable()
export class UserLogService {
  private admin: Admin = {
    email: '',
    firstName: '',
    lastName: '',
    nationalId: '',
    phoneNumber: ''
  };
  token: string;
  loginStatus = new Subject<string>();

  constructor(private router: Router, private http: HttpClient) {}

  isAuthenticated() {
    if (this.token) {
      return true;
    } else {
      return false;
    }
  }

  getAdmin() {
    return this.admin;
  }

  checkUserLog() {
    let username: string;
    let password: string;
    if (document.cookie.length >= 10) {
      const cookies = document.cookie;
      const cookiesArray = cookies.split(';');

      password = cookiesArray[1].slice(
        cookiesArray[1].indexOf('=') + 1,
        cookiesArray[1].length
      );
      username = cookiesArray[0].slice(
        cookiesArray[0].indexOf('=') + 1,
        cookiesArray[0].length
      );
    } else {
      this.router.navigate(['/login']);
    }
  }

  setUserLog(email: string, password: string) {
    this.loginStatus.next('trying');
    return this.http
      .post(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDQzg-HPGZMTjU2G4ycrSYh2Kv9JNNFBd4',
        {
          email: email,
          password: password,
          returnSecureToken: true
        }
      )
      .subscribe(
        response => {
          this.token = response.idToken;
          this.loginStatus.next('successful');

          // Auto logout in 1 hour
          setTimeout(() => {
            this.token = null;
            this.router.navigate(['/login']);
          }, response.expiresIn * 1000);

          // Navigate to home/games if valid creds
          this.router.navigate(['/home/games']);
        },
        error => {
          this.loginStatus.next('failure');
          //   if (error.status !== 0) {
          //     if (error.body.error.message) {
          //       commit('invalidCreds', true);
          //       commit('connectionFailed', false);
          //     }
          //   } else {
          //     commit('connectionFailed', true);
          //     commit('invalidCreds', false);
          //   }
          //   commit('loggingIn', false);
        }
      );

    // this.token = true;

    // setTimeout(() => {
    //   document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    //   document.cookie = 'password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    // }, 3600 * 1000);
  }
}
