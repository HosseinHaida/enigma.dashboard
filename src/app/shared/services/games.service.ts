import { ReferenceMission } from '../models/reference-mission.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Game } from '../models/game.model';

@Injectable()
export class GamesService {
  connection = 'http://localhost:3000/games';
  private games: Game[] = [];
  gamesUpdated = new Subject<Game[]>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  pushGames(games: Game[]) {
    this.games = games;
    console.log(this.games);
  }

  getGamesAPI() {
    return this.http.get<Game[]>(this.connection).pipe(
      map(gamesData => {
        return gamesData.map(game => {
          return {
            id: game.id,
            userId: game.userId,
            name: game.name,
            level: game.level,
            playersLimit: game.playersLimit,
            city: game.city,
            region: game.region,
            cost: game.cost,
            prize: game.prize,
            missions: game.missions,
            photoPath: game.photoPath
          };
        });
      })
    );
  }

  getGames() {
    return [...this.games];
  }

  onMissionDeleted(id: number) {
    this.games.forEach(game => {
      const missionsLength = game.missions.length;
      game.missions = game.missions.filter(
        (mission: ReferenceMission) => mission.id !== id
      );
      if (game.missions.length !== missionsLength) {
        this.http.put(this.connection + '/' + game.id, game).subscribe();
      }
    });
    this.gamesUpdated.next([...this.games]);
  }

  deleteGame(id: number) {
    // Send a delete request
    this.http.delete(this.connection + '/' + id).subscribe(() => {
      const index = this.findGame(id);
      this.games.splice(index, 1);
      this.gamesUpdated.next([...this.games]);
    });
  }

  isEmptyGames() {
    if (this.games.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  addGame(newGame: Game) {
    this.games.push(newGame);
    // send a post request
    this.http.post(this.connection, newGame).subscribe(
      () => {
        this.getGamesAPI().subscribe(games => {
          this.games = games;
          this.gamesUpdated.next([...this.games]);
        });
      },
      error => {
        console.log(error);
      }
    );
  }

  updateGame(id: number, updatedGame: Game) {
    // send a put request
    this.http.put(this.connection + '/' + id, updatedGame).subscribe(
      () => {
        this.getGamesAPI().subscribe(games => {
          this.games = games;
          this.gamesUpdated.next([...this.games]);
        });
      },
      error => {
        console.log(error);
      }
    );
  }

  getGame(id: number) {
    let index = -1;
    index = this.findGame(id);
    if (index === -1) {
      console.log('Didn\'t find the game!');
      this.router.navigate(['/home/games']);
    } else {
      return this.games[index];
    }
  }

  findGame(id: number): number {
    let index = -1;
    if (!this.isEmptyGames()) {
      for (let i = 0; i < Object.keys(this.games).length; i++) {
        if (this.games[i].id === id) {
          index = this.games.indexOf(this.games[i]);
          return index;
        }
      }
    } else {
      console.log('No games!');
    }
    return 0;
  }
}
