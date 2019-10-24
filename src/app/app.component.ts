import { UserLogService } from './shared/services/user-log.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private userLogService: UserLogService) {}

  ngOnInit() {
    this.userLogService.checkUserLog();
  }
}
