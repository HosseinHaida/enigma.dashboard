import { GamesService } from '../services/games.service';
import { Observable } from 'rxjs';
import { Game } from '../models/game.model';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Injectable } from "@angular/core";

@Injectable()
export class GamesResolver implements Resolve<Game[]> {
  constructor(private service: GamesService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<Game[]> {
    return this.service.getGamesAPI();
  }
}
