import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject, Observable } from 'rxjs';

import { GamesService } from './games.service';
import { Mission } from '../models/mission.model';
// import { UserLogService } from './user-log.service';

// import { AngularFireDatabase } from '@angular/fire/database';

@Injectable()
export class MissionsService {
  // connection = 'http://localhost:3000/missions';
  // connection = 'https://enigma-ng.firebaseio.com/missions.json';
  connection = 'https://us-central1-enigma-ng.cloudfunctions.net/api';
  missions: Mission[] = [];
  missionsUpdated = new Subject<Mission[]>();
  mission$: Observable<Mission[]>;

  constructor(
    private gamesService: GamesService,
    private http: HttpClient,
    private router: Router
    // private db: AngularFireDatabase
  ) { }

  pushMissions(missions: Mission[]) {
    this.missions = missions;
    console.log(this.missions);
  }

  getMissionsAPI() {
    return <Promise<Mission[]>>this.http.get(this.connection + '/missions').toPromise().then((object: { missions, proto }) => {
      return object.missions
    },
      error => {
        console.log(error)
      });
  }

  getMissions() {
    return this.missions
  }

  deleteMission(id: string) {
    this.http.delete(this.connection + '/missions/' + id).subscribe(() => {
      this.getMissionsAPI().then(missions => {
        this.missions = missions;
        this.missionsUpdated.next([...this.missions]);
        this.gamesService.onMissionDeleted(id);
      });
    },
      error => {
        console.log('Unable to remove mission !!')
        console.log(error)
      });
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
    this.http.post(this.connection + '/missions', newMission).subscribe(() => {
      this.getMissionsAPI().then(missions => {
        this.missions = missions;
        this.missionsUpdated.next([...this.missions]);
      });
    },
      error => {
        console.log('Unable to add new mission !!')
        console.log(error)
      })
  }

  updateMission(id: string, updatedMission: Mission) {
    this.http.patch(this.connection + '/missions/' + id, updatedMission).subscribe(() => {
      this.getMissionsAPI().then(missions => {
        this.missions = missions;
        this.missionsUpdated.next([...this.missions]);
      });
    },
      error => {
        console.log('Unable to update mission !!')
        console.log(error)
      })
    // const missionsRef = this.db.database.ref('missions');
    // missionsRef.child(id).set(updatedMission).then(
    //   () => {
    //     this.getMissionsAPI().then(missions => {
    //       this.missions = missions;
    //       this.missionsUpdated.next([...this.missions]);
    //     });
    //   }
    // ).catch(
    //   error => {
    //     console.log('Unable to update mission !!')
    //     console.log(error)
    //   }
    // );
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
