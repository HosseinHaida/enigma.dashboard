import { GamesService } from './../../shared/services/games.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ChallengesService } from './../../shared/services/challenges.service';
import { Challenge } from '../../shared/models/challenge.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  faTrashAlt,
  faImage,
  faCalendar
} from '@fortawesome/free-solid-svg-icons';
import { DatePickerComponent } from 'ng2-jalali-date-picker';

@Component({
  selector: 'app-challenges',
  templateUrl: './challenges.component.html',
  styleUrls: ['./challenges.component.scss']
})
export class ChallengesComponent implements OnInit {
  faTrash = faTrashAlt;
  faImage = faImage;
  faCalendar = faCalendar;

  datePickerConfig = {
    showTwentyFourHours: true,
    hideOnOutsideClick: false
  };

  challenges: Challenge[];
  tableHeaders: string[] = ['Manage', 'Game', 'Progress', 'Slug', 'Image'];
  // for the Filter Pipe
  tableFilterTypes: string[] = ['', '', ''];
  arrayItemKeys: string[] = ['gameName', 'progress', 'slug'];

  @ViewChild('timePicker', { static: true }) timePicker: DatePickerComponent;

  constructor(
    private challengesService: ChallengesService,
    private gamesService: GamesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.challenges = this.challengesService.getChallenges();
    this.fillChallengesExtras();
    this.challengesService.challengesUpdated.subscribe(updatedChallenges => {
      this.challenges = updatedChallenges;
      this.fillChallengesExtras();
    });
  }

  fillChallengesExtras() {
    this.challenges.forEach(challenge => {
      const game = this.gamesService.getGame(challenge.gameId);
      challenge.gameName = game.name;
      challenge.gamePhotoPath = game.photoPath;
    });
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  onChallengeDelete(id: number) {
    const answer = confirm('Are you sure?');
    if (answer) {
      this.challengesService.deleteChallenge(id);
    }
  }

  onChallengeTimeSet() {
    document.getElementById('overlay').classList.add('show');
    this.timePicker.api.open();
  }

  onCreateNew() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }
}
