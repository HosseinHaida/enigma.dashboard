import { Router, ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Challenge } from '../models/challenge.model';

@Injectable()
export class ChallengesService {
  connection = 'http://localhost:3000/challenges';
  private challenges: Challenge[] = [];
  challengesUpdated = new Subject<Challenge[]>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  pushChallenges(challenges: Challenge[]) {
    this.challenges = challenges;
    console.log(this.challenges);
  }

  getChallengesAPI(): Observable<Challenge[]> {
    return this.http.get<Challenge[]>(this.connection).pipe(
      map(challengesData => {
        return challengesData.map(challenge => {
          return {
            id: challenge.id,
            gameId: challenge.gameId,
            gameName: '', //  later gets value
            gamePhotoPath: '', // later gets value
            slug: challenge.slug,
            progress: challenge.progress,
            isFilled: challenge.isFilled,
            startTime: challenge.startTime
          };
        });
      })
    );
  }

  getChallenges() {
    return [...this.challenges];
  }
  deleteChallenge(id: number) {
    // Send a delete request
    this.http.delete(this.connection + '/' + id).subscribe(() => {
      const index = this.findChallenge(id);
      this.challenges.splice(index, 1);
      this.challengesUpdated.next([...this.challenges]);
    });
  }

  isEmptyChallenges() {
    if (this.challenges.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  addChallenge(challenge) {
    this.challenges.push(challenge);
    // send a post request
    this.http.post(this.connection, challenge).subscribe(
      () => {
        this.getChallengesAPI().subscribe(challenges => {
          this.challenges = challenges;
          this.challengesUpdated.next([...this.challenges]);
        });
      },
      error => {
        console.log(error);
      }
    );
  }

  // updateChallenge(id: number, newChallenge: Challenge) {
  //   const index = this.findChallenge(id);
  //   this.challenges[index] = newChallenge;
  // send a put request
  //   this.challengesUpdated.next(this.challenges.slice());
  // }

  getChallenge(id: number) {
    let index = -1;
    index = this.findChallenge(id);
    if (index === -1) {
      console.log('Didn\'t find the challenge!');
      this.router.navigate(['/home/challenges']);
    } else {
      return this.challenges[index];
    }
  }

  findChallenge(id: number): number {
    let index = -1;
    if (!this.isEmptyChallenges()) {
      for (let i = 0; i < Object.keys(this.challenges).length; i++) {
        if (this.challenges[i].id === id) {
          index = this.challenges.indexOf(this.challenges[i]);
          return index;
        }
      }
    } else {
      console.log('No challenges!');
    }
    return 0;
  }
}
