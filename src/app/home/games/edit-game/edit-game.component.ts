import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { Game } from '../../../shared/models/game.model';
import { Mission } from './../../../shared/models/mission.model';
import { ReferenceMission } from '../../../shared/models/reference-mission.model';
import { MissionsService } from '../../../shared/services/missions.service';
import { GamesService } from '../../../shared/services/games.service';
import { NoTagsPipe } from 'src/app/shared/pipes/no-tags.pipe';

@Component({
  selector: 'app-edit-game',
  templateUrl: './edit-game.component.html',
  styleUrls: ['./edit-game.component.scss']
})
export class EditGameComponent implements OnInit {
  editMode: boolean;
  initPermit = false;
  gameForm: FormGroup;
  gameId: number;
  game: Game;
  missions: Mission[];
  noTagsPipe: NoTagsPipe;

  constructor(
    private gamesService: GamesService,
    private missionsService: MissionsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    //  Get missions
    this.missions = this.missionsService.getMissions();
    this.missionsService.missionsUpdated.subscribe(missions => {
      this.missions = missions;
    });
    //  Get id from URL
    this.route.params.subscribe((params: Params) => {
      this.gameId = Number(params['id']);
      this.editMode = params['id'] != null;
      this.initPermit = true;
      this.initForm();
    });
  }

  private initForm() {
    let userId = '',
      name = '',
      level = 1,
      playersLimit = 1,
      city = '',
      region = '',
      cost = '',
      prize = '',
      photoPath = '';
    const missions = new FormArray([]);

    if (this.editMode) {
      // Use the noTagsPipe for each of the missions
      this.noTagsPipe = new NoTagsPipe();

      this.game = this.gamesService.getGame(this.gameId);
      userId = this.game.userId;
      name = this.game.name;
      level = this.game.level;
      playersLimit = this.game.playersLimit;
      city = this.game.city;
      region = this.game.region;
      cost = this.game.cost;
      prize = this.game.prize;
      photoPath = this.game.photoPath;

      for (const mission of this.game.missions) {
        const currMission = this.missionsService.getMission(mission.id);
        missions.push(
          new FormGroup({
            id: new FormControl({ value: mission.id, disabled: true }),
            name: new FormControl({ value: currMission.name, disabled: true }),
            script: new FormControl({
              value: this.noTagsPipe.transform(currMission.script),
              disabled: true
            }),
            order: new FormControl(mission.order)
          })
        );
      }
    }

    this.gameForm = new FormGroup({
      userId: new FormControl(userId, Validators.required),
      name: new FormControl(name, Validators.required),
      level: new FormControl(level, Validators.required),
      playersNo: new FormControl(playersLimit, Validators.required),
      missions: missions,
      city: new FormControl(city, Validators.required),
      region: new FormControl(region, Validators.required),
      cost: new FormControl(cost, Validators.required),
      prize: new FormControl(prize, Validators.required),
      photoPath: new FormControl(photoPath, Validators.required)
    });
  }

  onMissionAdd() {
    (<FormArray>this.gameForm.controls['missions']).push(
      new FormGroup({
        id: new FormControl(
          { value: null, disabled: true },
          Validators.required
        ),
        name: new FormControl({ value: 'Choose one', disabled: true }),
        script: new FormControl({ value: 'Choose one', disabled: true }),
        order: new FormControl(null, Validators.required)
      })
    );
  }

  onSubmit() {
    const newGameMissions: ReferenceMission[] = [];
    for (const mission of this.gameForm.get('missions')['controls']) {
      newGameMissions.push(
        new ReferenceMission(
          mission.controls.id.value,
          mission.controls.order.value
        )
      );
    }
    const newGame = new Game(
      this.editMode ? this.gameId : null,
      this.gameForm.value['userId'],
      this.gameForm.value['name'],
      this.gameForm.value['level'],
      this.gameForm.value['playersNo'],
      this.gameForm.value['city'],
      this.gameForm.value['region'],
      this.gameForm.value['cost'],
      this.gameForm.value['prize'],
      newGameMissions,
      this.gameForm.value['photoPath']
    );
    this.editMode
      ? this.gamesService.updateGame(this.gameId, newGame)
      : this.gamesService.addGame(newGame);
    this.onCancel();
  }

  onSelectOption(id: number, formControlName: string) {
    const missionAt = (<FormArray>this.gameForm.controls['missions']).controls[
      formControlName
    ];
    const currMission = this.missionsService.getMission(Number(id));
    missionAt.controls['id'].patchValue(currMission.id);
    missionAt.controls['name'].patchValue(currMission.name);
    missionAt.controls['script'].patchValue(currMission.script);
  }

  onMissionDelete(index: number) {
    (<FormArray>this.gameForm.controls['missions']).removeAt(index);
  }

  onMissionEdit(id: number) {
    this.router.navigate(['./home/missions/edit', id]);
  }

  onCancel() {
    this.router.navigate(['/home/games']);
  }
}
