import { ResponsiveDesignService } from '../../shared/services/responsive-design.service';
import { UserLogService } from '../../shared/services/user-log.service';
import { Component, OnInit } from '@angular/core';
// import { Subject } from 'rxjs';
import {
  faBars,
  faHome,
  faDiceFive,
  faPuzzlePiece,
  faDice,
  faUsers,
  faChartPie
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbars',
  templateUrl: './navbars.component.html',
  styleUrls: ['./navbars.component.scss']
})
export class NavbarsComponent implements OnInit {
  /// icons
  faBars = faBars;
  faHome = faHome;
  faGames = faDiceFive;
  faMissions = faPuzzlePiece;
  faChallenges = faDice;
  faUsers = faUsers;
  faStats = faChartPie;

  sideBar: Element;
  admin: Admin = {
    displayName: '',
    email: '',
    photoURL: '',
    uid: ''
  };
  toggleSideBar = false;

  constructor(
    private userLogService: UserLogService,
    private responsiveDesignService: ResponsiveDesignService
  ) {
    this.userLogService.whoIsAdmin.subscribe(admin => {
      this.admin = admin;
      console.log(admin);
    });
    if (!this.admin.displayName) {
      this.admin.displayName = localStorage.getItem('displayName');
      this.admin.photoURL = localStorage.getItem('photoURL');
    }
  }

  ngOnInit() {
    this.sideBar = document.getElementsByClassName('side-navbar')[0];
    // this.responsiveDesignService.onScreenResize.subscribe(
    //   (layout: Layout) => {
    //     this.layout = layout;
    //     if (layout.isSmall || layout.isXSmall) {
    //       this.sideBar.classList.add('on-small-screens');
    //     } else {
    //       this.sideBar.classList.remove('on-small-screens');
    //     }
    //   }
    // );
  }

  onSignOut() {
    this.userLogService.logout(0);
  }

  onSideBarClick() {
    this.toggleSideBar = !this.toggleSideBar;
    if (this.toggleSideBar) {
      this.sideBar.classList.add('shown');
    } else {
      this.sideBar.classList.remove('shown');
    }
    this.responsiveDesignService.onSideBarToggle.next(this.toggleSideBar);
  }
}
