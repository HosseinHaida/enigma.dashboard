import { ResponsiveDesignService } from '../../shared/services/responsive-design.service';
import { UserLogService } from '../../shared/services/user-log.service';
import { Component, OnInit, Output } from '@angular/core';
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
  /// end of icons

  sideBar: Element;
  private admin: Admin;
  toggleSideBar = false;
  screenSizeCaught = false;
  screenWidth: number;
  // layout: Layout;
  firstName: string;
  lastName: string;

  constructor(private userLogService: UserLogService,
              private responsiveDesignService: ResponsiveDesignService) { }

  ngOnInit() {
    this.admin = this.userLogService.getAdmin();
    this.firstName = this.admin.firstName;
    this.lastName = this.admin.lastName;
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

  onSideBarClick() {
    this.toggleSideBar = !this.toggleSideBar;
    // if (!this.screenSizeCaught) {
    //   this.responsiveDesignService.getScreenLayout();
    //   // to execute only once
    //   this.screenSizeCaught = true;
    // }
    if (this.toggleSideBar) {
      this.sideBar.classList.add('shown');
    } else {
      this.sideBar.classList.remove('shown');
    }
    this.responsiveDesignService
      .onSideBarToggle
        .next(this.toggleSideBar);
  }
}
