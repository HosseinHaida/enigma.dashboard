import { UserLogService } from './shared/services/user-log.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private router: Router, private useLogService: UserLogService) {
    if (!this.useLogService.isAuthenticated()) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/home/games']);
    }
  }
}
