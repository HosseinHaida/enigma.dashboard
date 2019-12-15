import { Game } from './../../shared/models/game.model';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  faPenAlt,
  faTrashAlt,
  faClone,
  faImage
} from '@fortawesome/free-solid-svg-icons';
import { GamesService } from '../../shared/services/games.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class GamesComponent implements OnInit {
  faEdit = faPenAlt;
  faDelete = faTrashAlt;
  faClone = faClone;
  faImage = faImage;

  games: Game[];
  tableHeaders: string[] = ['Manage', 'City', 'Region', 'Name', 'Image'];
  // for the Filter Pipe
  tableFilterTypes: string[] = ['', '', ''];
  arrayItemKeys: string[] = ['city', 'region', 'name'];

  constructor(
    private gamesService: GamesService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.games = this.gamesService.getGames();
    this.gamesService.gamesUpdated.subscribe(updatedGames => {
      this.games = updatedGames;
    });
  }

  genPropertyValuesOfGame(game: any) {
    return Object.keys(game).map(key => {
      // in th DOM it shows the
      // number of missions instead of missions themselves
      if (key === 'missions') {
        return game[key].length;
      } else {
        return game[key];
      }
    });
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  onGameEdit(id: number) {
    this.router.navigate(['edit', id], { relativeTo: this.route });
  }

  onGameClone(id: number) {
    this.router.navigate(['../challenges/create', id], {
      relativeTo: this.route
    });
  }

  onGameDelete(id: string) {
    const answer = confirm('Are you sure?');
    if (answer) {
      this.gamesService.deleteGame(id);
    }
  }

  onCreateNew() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }
}
