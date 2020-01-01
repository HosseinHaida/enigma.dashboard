import { UserLogService } from './shared/services/user-log.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private userLogService: UserLogService) { }
  ngOnInit() {
    this.userLogService.checkSignedUserStatusAndSignTheUnauthorizedOut();
  }
}
