import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ChallengesService } from './../shared/services/challenges.service';
import { GamesService } from '../shared/services/games.service';
import { MissionsService } from '../shared/services/missions.service';
import { ResponsiveDesignService } from '../shared/services/responsive-design.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  overlay: Element;
  routerOutletComp: Element;

  constructor(
    private responsiveDesignService: ResponsiveDesignService,
    private challengesService: ChallengesService,
    private missionsService: MissionsService,
    private gamesService: GamesService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    //  Resolve missions and games data
    this.route.data.subscribe(({ missions, games, challenges }) => {
      this.challengesService.pushChallenges(challenges);
      this.missionsService.pushMissions(missions);
      this.gamesService.pushGames(games);
    });
    this.overlay = document.getElementsByClassName('overlay')[0];
    this.routerOutletComp = document.getElementsByClassName('router-outlet')[0];

    // Subscribe to side bar toggle
    this.responsiveDesignService.onSideBarToggle.subscribe(
      (sideBarToggle: boolean) => {
        if (sideBarToggle) {
          this.routerOutletComp.classList.add('drawn');
          this.overlay.classList.add('overlay--show');
        } else {
          this.routerOutletComp.classList.remove('drawn');
          this.overlay.classList.remove('overlay--show');
        }
      }
    );
  }
}
