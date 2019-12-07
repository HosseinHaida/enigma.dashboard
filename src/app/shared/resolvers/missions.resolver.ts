import { Observable } from 'rxjs';
import { MissionsService } from '../services/missions.service';
import { Mission } from '../models/mission.model';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { DataSnapshot } from '@angular/fire/database/interfaces';

export class MissionsResolver implements Resolve<Mission[]> {
  constructor(private service: MissionsService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<Mission[]> {
    return this.service.getMissionsAPI();
  }
}
