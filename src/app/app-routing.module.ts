import { ChallengesResolver } from './shared/resolvers/challenges.resolver';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { GamesResolver } from './shared/resolvers/games.resolver';
import { MissionsResolver } from './shared/resolvers/missions.resolver';
import { GamesComponent } from './home/games/games.component';
import { EditGameComponent } from './home/games/edit-game/edit-game.component';
import { MissionsComponent } from './home/missions/missions.component';
import { EditMissionComponent } from './home/missions/edit-mission/edit-mission.component';
import { ChallengesComponent } from './home/challenges/challenges.component';
import { CreateChallengeComponent } from './home/challenges/create-challenge/create-challenge.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { StatisticsComponent } from './home/statistics/statistics.component';
import { UsersComponent } from './home/users/users.component';
import { AuthGuard } from './shared/services/auth-guard.service';

const appRoutes: Routes = [
  { path: 'login', component: LoginPageComponent },
  {
    path: 'home',
    component: HomeComponent,
    resolve: {
      missions: MissionsResolver,
      games: GamesResolver,
      challenges: ChallengesResolver
    },
    children: [
      { path: 'games', component: GamesComponent },
      { path: 'games/edit/:id', component: EditGameComponent },
      { path: 'games/edit', component: EditGameComponent },

      { path: 'missions', component: MissionsComponent },
      { path: 'missions/edit/:id', component: EditMissionComponent },
      { path: 'missions/edit', component: EditMissionComponent },

      { path: 'challenges', component: ChallengesComponent },
      { path: 'challenges/new', component: CreateChallengeComponent },

      { path: 'stats', component: StatisticsComponent },
      { path: 'users', component: UsersComponent }
    ],
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'home/games',
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
