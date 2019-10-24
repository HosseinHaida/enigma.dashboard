import { Game } from './../../../shared/models/game.model';
import { GamesService } from '../../../shared/services/games.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
// import { Params } from '@fortawesome/fontawesome-svg-core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
// import { Challenge } from 'src/app/shared/models/challenge.model';
import { ChallengesService } from 'src/app/shared/services/challenges.service';

@Component({
  selector: 'app-create-challenge',
  templateUrl: './create-challenge.component.html',
  styleUrls: ['./create-challenge.component.scss']
})
export class CreateChallengeComponent implements OnInit {
  games: Game[];
  game: Game;
  challengeForm: FormGroup;

  constructor(
    private challengesService: ChallengesService,
    private gamesService: GamesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.games = this.gamesService.getGames();
    this.gamesService.gamesUpdated.subscribe(games => {
      this.games = games;
    });
    this.initForm();
  }

  private initForm() {
    const name = '',
      gameName = '__',
      gameCity = '__',
      gameRegion = '__';

    this.challengeForm = new FormGroup({
      id: new FormControl({ value: null, disabled: true }),
      name: new FormControl(name, Validators.required),
      gameName: new FormControl({ value: gameName, disabled: true }),
      gameCity: new FormControl({ value: gameCity, disabled: true }),
      gameRegion: new FormControl({ value: gameRegion, disabled: true })
    });
  }

  onSelectOption(gameId: number) {
    this.game = this.gamesService.getGame(Number(gameId));
    this.challengeForm.get('gameName').patchValue(this.game.name);
    this.challengeForm.get('gameCity').patchValue(this.game.city);
    this.challengeForm.get('gameRegion').patchValue(this.game.region);
  }

  onSubmit() {
    const challenge = {
      id: null,
      gameId: this.game.id,
      slug: this.challengeForm.get('name').value,
      progress: 0,
      isFilled: false,
      startTime: '',
      players: []
    };
    this.challengesService.addChallenge(challenge);
    this.onCancel();
  }

  onCancel() {
    this.router.navigate(['/home/challenges']);
  }
}
