import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { UserLogService } from '../shared/services/user-log.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  loginForm: FormGroup;
  private admin: Admin;

  constructor(private userLogService: UserLogService, private router: Router) {}

  ngOnInit() {
    if (this.userLogService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
    this.loginForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    });
    this.admin = this.userLogService.getAdmin();
  }

  onSubmit(form: NgForm | FormGroup) {
    const userName = form.value.username;
    const password = form.value.password;
    const helperText = document.getElementsByClassName('helper-text')[0];
    if (userName === this.admin.userName && password === this.admin.password) {
      helperText.classList.remove('shown');
      this.userLogService.setUserLog(userName, password);
    } else {
      helperText.classList.add('shown');
    }
    setTimeout(() => {
      helperText.classList.remove('shown');
    }, 820);
  }
}
