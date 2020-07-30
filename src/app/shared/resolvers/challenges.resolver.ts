import { Challenge } from '../models/challenge.model';
import { ChallengesService } from './../services/challenges.service';
import { Observable } from 'rxjs';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Injectable } from "@angular/core";

@Injectable()
export class ChallengesResolver implements Resolve<Challenge[]> {
  constructor(private service: ChallengesService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<Challenge[]> {
    return this.service.getChallengesAPI();
  }
}
