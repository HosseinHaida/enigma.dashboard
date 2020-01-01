import { Router, ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs';

import { Challenge } from '../models/challenge.model';

@Injectable()
export class ChallengesService {
  connection = 'https://us-central1-enigma-ng.cloudfunctions.net/api';
  private challenges: Challenge[] = [];
  challengesUpdated = new Subject<Challenge[]>();

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  pushChallenges(challenges: Challenge[]) {
    this.challenges = challenges;
    console.log(this.challenges);
  }

  getChallengesAPI() {
    return <Promise<Challenge[]>>this.http.get(this.connection + '/challenges').toPromise().then((object: { challenges, proto }) => {
      return object.challenges
    },
      error => {
        console.log(error)
      });
  }

  getChallenges() {
    return [...this.challenges];
  }

  deleteChallenge(id: string) {
    this.http.delete(this.connection + '/challenges/' + id).subscribe(() => {
      this.getChallengesAPI().then(challenges => {
        this.challenges = challenges;
        this.challengesUpdated.next([...this.challenges]);
      });
    },
      error => {
        console.log('Unable to remove challenge !!')
        console.log(error)
      });
  }

  isEmptyChallenges() {
    if (this.challenges.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  addChallenge(newChallenge: Challenge) {
    const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    newChallenge.id = id;
    this.http.post(this.connection + '/challenges', newChallenge).subscribe(() => {
      this.getChallengesAPI().then(challenges => {
        this.challenges = challenges;
        this.challengesUpdated.next([...this.challenges]);
      });
    },
      error => {
        console.log('Unable to add new challenge !!')
        console.log(error)
      })
  }

  getChallenge(id: string) {
    let index = -1;
    index = this.findChallenge(id);
    if (index === -1) {
      console.log('Didn\'t find the challenge!');
      this.router.navigate(['/home/challenges']);
    } else {
      return this.challenges[index];
    }
  }

  findChallenge(id: string): number {
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
