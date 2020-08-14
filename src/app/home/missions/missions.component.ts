import { Router, ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";

import { Mission } from "./../../shared/models/mission.model";
import { MissionsService } from "../../shared/services/missions.service";
import {
  faEye,
  faTrashAlt,
  faImage,
  faAlignJustify,
} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-missions",
  templateUrl: "./missions.component.html",
  styleUrls: ["./missions.component.scss"],
})
export class MissionsComponent implements OnInit {
  faEdit = faAlignJustify;
  faDelete = faTrashAlt;
  faImage = faImage;

  missions: Mission[];
  tableHeaders: string[] = ["Manage", "Script", "Name", "Image"];

  // for the Filter Pipe
  tableFilterTypes: string[] = ["", ""];
  arrayItemKeys: string[] = ["script", "name"];

  constructor(
    private missionsService: MissionsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.missions = this.missionsService.getMissions();
    this.missionsService.missionsUpdated.subscribe((updatedMissions) => {
      this.missions = updatedMissions;
    });
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  genPropertyValuesOfMission(mission: Mission) {
    return Object.keys(mission).map((key) => {
      return mission[key];
    });
  }

  onCreateNew() {
    this.router.navigate(["edit"], { relativeTo: this.route });
  }

  onMissionDelete(id: string) {
    const answer = confirm("Are you sure?");
    if (answer) {
      this.missionsService.deleteMission(id);
    }
  }

  onMissionEdit(id: number) {
    this.router.navigate(["edit", id], { relativeTo: this.route });
  }
}
