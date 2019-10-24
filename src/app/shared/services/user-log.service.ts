import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class UserLogService {
  private admin: Admin = {
    // userName: atob('SHVzc2VpbkhhaWRh'),
    userName: 'hossein',
    // password: atob('Z29vZ2xl'),
    password: '12345678',
    // firstName: atob('SHVzc2Vpbg=='),
    firstName: 'hossein',
    // lastName: atob('SGFpZGFyaQ=='),
    lastName: 'heidari',
    // email: atob('c3F1YW5kZXJuZXNzQGdtYWlsLmNvbQ=='),
    email: 'squanderness@gmail.com',
    // number: atob('MDkxMzQwNTY3NTc=')
    number: '100'
  };
  token = false;

  constructor(private router: Router) {}

  isAuthenticated() {
    return this.token;
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

      if (
        // atob(username)
        username === this.admin.userName &&
        password === this.admin.password
      ) {
        this.token = true;
      } else {
        this.token = false;
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  setUserLog(username: string, password: string) {
    const now = new Date();
    let time = now.getTime();
    time += 3600 * 1000;
    now.setTime(time);
    document.cookie =
      'username=' +
      btoa(username) +
      '; expires=' +
      now.toUTCString() +
      '; path=/';
    document.cookie =
      'password=' +
      btoa(password) +
      '; expires=' +
      now.toUTCString() +
      '; path=/';

    this.token = true;
    this.router.navigate(['/home/games']);

    // setTimeout(() => {
    //   document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    //   document.cookie = 'password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    // }, 3600 * 1000);
  }
}
