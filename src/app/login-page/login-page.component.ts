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
  loginStatusGifSource: string = null;

  constructor(private userLogService: UserLogService, private router: Router) { }

  ngOnInit() {
    if (this.userLogService.isAuthenticated()) {
      this.router.navigate(['/home/games']);
    }
    this.loginForm = new FormGroup({
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    });
    this.userLogService.loginStatus.subscribe(status => {
      this.loginStatusGifSource = 'assets/' + status + '.gif'
    });
  }

  onSubmit(form: NgForm | FormGroup) {
    if (!this.loginForm.invalid) {
      const email = form.value.email;
      const password = form.value.password;
      this.userLogService.login(email, password);
    }
  }
}
