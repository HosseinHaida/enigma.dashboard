import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { UserLogService } from '../shared/services/user-log.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})
export class SignupPageComponent implements OnInit {
  signupForm: FormGroup;
  private admin: Admin;
  signupStatusGifSource: string = null;

  constructor(private userLogService: UserLogService, private router: Router) { }

  ngOnInit() {
    this.signupForm = new FormGroup({
      displayName: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      phoneNumber: new FormControl(null, Validators.required),
      photoURL: new FormControl(null, Validators.required)
    });
    this.userLogService.signupStatus.subscribe(status => {
      this.signupStatusGifSource = 'assets/' + status + '.gif';
    });
  }

  async onSubmit(form: NgForm | FormGroup) {
    if (!this.signupForm.invalid) {
      const newAdmin = {
        displayName: form.value.displayName,
        email: form.value.email,
        password: form.value.password,
        phoneNumber: form.value.phoneNumber,
        photoURL: form.value.photoURL,
        role: 'admin'
      };
      this.userLogService.signNewUserUp(newAdmin);
    }

  };

}
