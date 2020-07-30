import { Subject } from 'rxjs';
import { Injectable } from "@angular/core";

@Injectable()
export class ResponsiveDesignService {
  screenWidth: number;
  onScreenResize = new Subject<Layout>();
  onSideBarToggle = new Subject<boolean>();
  layout: Layout = {
    isLarge: false,
    isMedium: false,
    isSmall: false,
    isXSmall: false
  };

  constructor() {
    window.addEventListener('resize', () => {
      this.getScreenLayout();
     });
  }

  getScreenLayout() {
    this.screenWidth = window.innerWidth;
    this.layout.isLarge = this.screenWidth < 1920 && this.screenWidth > 1365;
    this.layout.isMedium = this.screenWidth < 1365 && this.screenWidth > 1181;
    this.layout.isSmall = this.screenWidth < 1226;
    this.layout.isXSmall = this.screenWidth < 767;
    this.onScreenResize.next(this.layout);
  }
}
