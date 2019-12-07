//  Angular imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Seting up Firebase
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';

//  Resolvers
import { MissionsResolver } from './shared/resolvers/missions.resolver';
import { GamesResolver } from './shared/resolvers/games.resolver';
import { ChallengesResolver } from './shared/resolvers/challenges.resolver';

//  Components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavbarsComponent } from './home/navbars/navbars.component';
import { ChallengesComponent } from './home/challenges/challenges.component';
import { CreateChallengeComponent } from './home/challenges/create-challenge/create-challenge.component';
import { UsersComponent } from './home/users/users.component';
import { StatisticsComponent } from './home/statistics/statistics.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { GamesComponent } from './home/games/games.component';
import { EditGameComponent } from './home/games/edit-game/edit-game.component';
import { MissionsComponent } from './home/missions/missions.component';
import { EditMissionComponent } from './home/missions/edit-mission/edit-mission.component';

//  Services
import { AuthGuard } from './shared/services/auth-guard.service';
import { UserLogService } from './shared/services/user-log.service';
import { ResponsiveDesignService } from './shared/services/responsive-design.service';
import { MissionsService } from './shared/services/missions.service';
import { GamesService } from './shared/services/games.service';
import { ChallengesService } from './shared/services/challenges.service';
import { FirebaseStoreService } from './shared/services/firestore.service';

// Routing
import { AppRoutingModule } from './app-routing.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

//  Icons
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

//  Pipes
import { FilterPipe } from './shared/pipes/filter.pipe';
import { NoTagsPipe } from './shared/pipes/no-tags.pipe';

//  Text Editor
import { TxtEditorComponent } from './shared/txt-editor/txt-editor.component';

//  Loading Bar for http requests status
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';

// Jalali calendar date picker
import { DpDatePickerModule } from 'ng2-jalali-date-picker';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ChallengesComponent,
    GamesComponent,
    MissionsComponent,
    UsersComponent,
    StatisticsComponent,
    LoginPageComponent,
    NavbarsComponent,
    PageNotFoundComponent,
    FilterPipe,
    NoTagsPipe,
    EditGameComponent,
    EditMissionComponent,
    CreateChallengeComponent,
    TxtEditorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    FormsModule,
    HttpClientModule,
    LoadingBarHttpClientModule,
    DpDatePickerModule,
    AngularFireModule.initializeApp(
      environment.firebaseConfig,
      'enigma-ng-app'
    ),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  providers: [
    UserLogService,
    AuthGuard,
    GamesService,
    MissionsService,
    ChallengesService,
    ResponsiveDesignService,
    ChallengesResolver,
    MissionsResolver,
    GamesResolver,
    FirebaseStoreService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
