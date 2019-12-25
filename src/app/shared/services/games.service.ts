import { ReferenceMission } from '../models/reference-mission.model';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs';
import { Game } from '../models/game.model';
// import { UserLogService } from './user-log.service';
// import { AngularFireDatabase } from '@angular/fire/database';

@Injectable()
export class GamesService {
  // connection = 'http://localhost:3000/games';
  // connection = 'https://enigma-ng.firebaseio.com/games.json';
  connection = 'https://us-central1-enigma-ng.cloudfunctions.net/api';
  // connection = 'http://localhost:5000/enigma-ng/us-central1/api';
  private games: Game[] = [];
  gamesUpdated = new Subject<Game[]>();

  constructor(
    private http: HttpClient,
    private router: Router,
    // private route: ActivatedRoute,
    // private userLogService: UserLogService,
    // private db: AngularFireDatabase
  ) { }

  pushGames(games: Game[]) {
    this.games = games;
    console.log(this.games);
  }

  getGamesAPI() {
    // const gamesRef = this.db.database.ref('games');
    // return gamesRef.once('value').then(snapshot => {
    //   return Object.keys(snapshot.val()).map(function (gameNamedIndex) {
    //     let game = snapshot.val()[gameNamedIndex];
    //     return game
    //   });
    // });
    return <Promise<Game[]>>this.http.get(this.connection + '/games').toPromise().then((object: { games, proto }) => {
      return object.games
    },
      error => {
        console.log(error)
      });
    // return this.http
    //   .get<Game[]>(this.connection + '?auth=' + this.userLogService.idToken)
    //   .pipe(
    //     map(gamesData => {
    //       return gamesData.map(game => {
    //         return {
    //           id: game.id,
    //           userId: game.userId,
    //           name: game.name,
    //           level: game.level,
    //           playersLimit: game.playersLimit,
    //           city: game.city,
    //           region: game.region,
    //           cost: game.cost,
    //           prize: game.prize,
    //           missions: game.missions,
    //           photoPath: game.photoPath
    //         };
    //       });
    //     })
    //   );
  }

  getGames() {
    return [...this.games];
  }

  onMissionDeleted(id: string) {
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

  deleteGame(id: string) {
    this.http.delete(this.connection + '/games/' + id).subscribe(() => {
      this.getGamesAPI().then(games => {
        this.games = games;
        this.gamesUpdated.next([...this.games]);
      });
    },
      error => {
        console.log('Unable to remove game !!')
        console.log(error)
      });
    // const gamesRef = this.db.database.ref('games');
    // gamesRef.child(id).remove().then(
    //   () => {
    //     this.getGamesAPI().then(games => {
    //       this.games = games;
    //       this.gamesUpdated.next([...this.games]);
    //     });
    //   }
    // ).catch(
    //   error => {
    //     console.log('Unable to remove game !!')
    //     console.log(error)
    //   }
    // );
    //////////////
    //   this.http.delete(this.connection + '/' + id).subscribe(() => {
    //     const index = this.findGame(id);
    //     this.games.splice(index, 1);
    //     this.gamesUpdated.next([...this.games]);
    // });
  }

  isEmptyGames() {
    if (this.games.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  addGame(newGame: Game) {
    const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    newGame.id = id;
    console.log(newGame);
    <Promise<any>>this.http.post(this.connection + '/games', newGame).toPromise().then(() => {
      this.getGamesAPI().then(games => {
        this.games = games;
        this.gamesUpdated.next([...this.games]);
      });
    },
      error => {
        console.log('Unable to add new game !!')
        console.log(error)
      })
    // //////
    // const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    // newGame.id = id;
    // const gamesRef = this.db.database.ref('games');
    // gamesRef.child(id).set(newGame).then(
    //   () => {
    //     this.getGamesAPI().then(games => {
    //       this.games = games;
    //       this.gamesUpdated.next([...this.games]);
    //     });
    //   }
    // ).catch(
    //   error => {
    //     console.log('Unable to add new game !!')
    //     console.log(error)
    //   }
    // );
    // /////////////////////////
    // this.games.push(newGame);
    // // send a post request
    // this.http.post(this.connection, newGame).subscribe(
    //   () => {
    //     this.getGamesAPI().subscribe(games => {
    //       this.games = games;
    //       this.gamesUpdated.next([...this.games]);
    //     });
    //   },
    //   error => {
    //     console.log(error);
    //   }
    // );
  }

  updateGame(id: string, updatedGame: Game) {
    this.http.patch(this.connection + '/games/' + id, updatedGame).subscribe(() => {
      this.getGamesAPI().then(games => {
        this.games = games;
        this.gamesUpdated.next([...this.games]);
      });
    },
      error => {
        console.log('Unable to update game !!')
        console.log(error)
      })

    // this.http.put(this.connection + '/' + id, updatedGame).subscribe(
    //   () => {
    //     this.getGamesAPI().subscribe(games => {
    //       this.games = games;
    //       this.gamesUpdated.next([...this.games]);
    //     });
    //   },
    //   error => {
    //     console.log(error);
    //   }
    // );
  }

  getGame(id: string) {
    let index = -1;
    index = this.findGame(id);
    if (index === -1) {
      console.log('Didn\'t find the game!');
      this.router.navigate(['/home/games']);
    } else {
      return this.games[index];
    }
  }

  findGame(id: string): number {
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
