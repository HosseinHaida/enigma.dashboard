import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit, AfterContentInit } from '@angular/core';

import { ResponsiveDesignService } from '../../../shared/services/responsive-design.service';
import { Mission } from './../../../shared/models/mission.model';
import { MissionsService } from '../../../shared/services/missions.service';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { UserLogService } from 'src/app/shared/services/user-log.service';

@Component({
  selector: 'app-edit-mission',
  templateUrl: './edit-mission.component.html',
  styleUrls: ['./edit-mission.component.scss']
})
export class EditMissionComponent implements OnInit, AfterContentInit {
  faCamera = faCamera;

  missionId: string;
  missionForm: FormGroup;
  editMode: boolean;
  initPermit = false;
  mission: Mission;
  layout: Layout;
  script: any;
  uid: string;

  constructor(
    private route: ActivatedRoute,
    private missionsService: MissionsService,
    private router: Router,
    private responsiveDesignService: ResponsiveDesignService,
    private userLogService: UserLogService
  ) { }

  ngOnInit() {
    //  Get id from URL
    this.route.params.subscribe((params: Params) => {
      this.missionId = params['id'];
      this.editMode = params['id'] != null;
      this.initPermit = true;
      this.initForm();
    });
    // Subscribe to screen resize
    this.responsiveDesignService.onScreenResize.subscribe((layout: Layout) => {
      this.layout = layout;
    });
  }

  ngAfterContentInit() {
    this.responsiveDesignService.getScreenLayout();
  }

  private initForm() {
    let name = '',
      level = 1,
      photoPath = '',
      script = '',
      slug = '',
      key = '';

    if (this.editMode) {
      this.mission = this.missionsService.getMission(this.missionId);
      name = this.mission.name;
      level = this.mission.level;
      photoPath = this.mission.photoPath;
      script = this.mission.script;
      slug = this.mission.slug;
      key = this.mission.key;
    }

    this.missionForm = new FormGroup({
      name: new FormControl(name),
      level: new FormControl(level),
      photoPath: new FormControl(photoPath),
      script: new FormControl(script),
      slug: new FormControl(slug),
      key: new FormControl(key)
    });
  }

  async onSubmit() {
    await this.userLogService.checkSignedUserStatusAndSignTheUnauthorizedOut();
    const uid = this.userLogService.getAdminUid();
    if (!uid || typeof (uid) === 'undefined') { alert('لطفا خارج شده و دوباره وارد سامانه شوید !'); return }

    const newMission = new Mission(
      this.editMode ? this.missionId : null,
      uid,
      this.missionForm.value['level'],
      this.missionForm.value['name'],
      this.missionForm.value['photoPath'],
      this.missionForm.value['slug'],
      this.missionForm.value['script'],
      this.missionForm.value['key']
    );
    this.editMode
      ? this.missionsService.updateMission(this.missionId, newMission)
      : this.missionsService.addMission(newMission);

    this.onCancel();
  }

  onCancel() {
    this.router.navigate(['/home/missions']);
  }

  onFilePick(event: Event) {
    const svgFile = (<HTMLInputElement>event.target).files[0];
  }
}
