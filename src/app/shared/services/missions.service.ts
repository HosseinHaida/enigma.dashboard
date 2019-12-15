import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';

import { Subject, Observable } from 'rxjs';

import { GamesService } from './games.service';
import { Mission } from '../models/mission.model';
// import { UserLogService } from './user-log.service';

import { AngularFireDatabase } from '@angular/fire/database';

@Injectable()
export class MissionsService {
  // connection = 'http://localhost:3000/missions';
  connection = 'https://enigma-ng.firebaseio.com/missions.json';
  missions: Mission[] = [];
  missionsUpdated = new Subject<Mission[]>();
  mission$: Observable<Mission[]>;

  constructor(
    private gamesService: GamesService,
    // private http: HttpClient,
    private router: Router,
    // private userLogService: UserLogService,
    private db: AngularFireDatabase
  ) { }

  pushMissions(missions: Mission[]) {
    this.missions = missions;
    console.log(this.missions);
  }

  getMissionsAPI() {
    ////////////////////////////
    const missionsRef = this.db.database.ref('missions');
    return missionsRef.once('value').then(snapshot => {
      return Object.keys(snapshot.val()).map(function (missionNamedIndex) {
        let mission = snapshot.val()[missionNamedIndex];
        return mission
      });
    });
    ////////////////////////////
    // return this.http
    //   .get<Mission[]>(this.connection + '?auth=' + this.userLogService.idToken)
    //   .pipe(
    //     map(missionsData => {
    //       return missionsData.map(mission => {
    //         return {
    //           id: mission.id,
    //           level: mission.level,
    //           name: mission.name,
    //           photoPath: mission.photoPath,
    //           slug: mission.slug,
    //           script: mission.script,
    //           key: mission.key
    //         };
    //       });
    //     })
    //   );
  }

  getMissions() {
    return this.missions
  }

  deleteMission(id: string) {
    const missionsRef = this.db.database.ref('missions');
    missionsRef.child(id).remove().then(
      () => {
        this.getMissionsAPI().then(missions => {
          this.missions = missions;
          this.missionsUpdated.next([...this.missions]);
          this.gamesService.onMissionDeleted(id);
        });
      }
    ).catch(
      error => {
        console.log('Unable to remove mission !!')
        console.log(error)
      }
    );
    // this.http.delete(this.connection + '/' + id).subscribe(() => {
    //   const index = this.findMission(id);
    //   this.missions.splice(index, 1);
    //   this.missionsUpdated.next([...this.missions]);
    //   this.gamesService.onMissionDeleted(id);
    // });
  }

  isEmptyMissions() {
    if (this.missions.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  getMission(id: string) {
    let index = -1;
    index = this.findMission(id);
    if (index === -1) {
      console.log('Didn\'t find the mission!');
      this.router.navigate(['/home/missions']);
    } else {
      return this.missions[index];
    }
  }

  addMission(newMission: Mission) {
    const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    newMission.id = id;
    const missionsRef = this.db.database.ref('missions');
    missionsRef.child(id).set(newMission).then(
      () => {
        this.getMissionsAPI().then(missions => {
          this.missions = missions;
          this.missionsUpdated.next([...this.missions]);
        });
      }
    ).catch(
      error => {
        console.log('Unable to add new mission !!')
        console.log(error)
      }
    );
    //   this.missions.push(newMission);
    //   // send a post request
    //   this.http.post(this.connection, newMission).subscribe(
    //     () => {
    //       this.getMissionsAPI().then(missions => {
    //         this.missions = missions;
    //         this.missionsUpdated.next([...this.missions]);
    //       });
    //     },
    //     error => {
    //       console.log(error);
    //     }
    //   );
  }

  updateMission(id: string, updatedMission: Mission) {
    const missionsRef = this.db.database.ref('missions');
    missionsRef.child(id).set(updatedMission).then(
      () => {
        this.getMissionsAPI().then(missions => {
          this.missions = missions;
          this.missionsUpdated.next([...this.missions]);
        });
      }
    ).catch(
      error => {
        console.log('Unable to update mission !!')
        console.log(error)
      }
    );
    //   // send a put request
    //   this.http.put(this.connection + '/' + id, updatedMission).subscribe(
    //     () => {
    //       this.getMissionsAPI().subscribe(missions => {
    //         this.missions = missions;
    //         this.missionsUpdated.next([...this.missions]);
    //       });
    //     },
    //     error => {
    //       console.log(error);
    //     }
    //   );
  }

  findMission(id: string): number {
    let index = -1;
    if (!this.isEmptyMissions()) {
      for (let i = 0; i < Object.keys(this.missions).length; i++) {
        if (this.missions[i].id === id) {
          index = this.missions.indexOf(this.missions[i]);
          return index;
        }
      }
    } else {
      console.log('No missions!');
    }
    return 0;
  }
}
