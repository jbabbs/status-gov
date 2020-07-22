import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { LocationStrategy } from '@angular/common';
import { AppService } from '../../app-service/app.service';

@Component({
  selector: 'sam-header',
  templateUrl: './sam-header.component.html',
  styleUrls: ['./sam-header.component.scss']
})
export class SamHeaderComponent implements OnInit {

  sectionId: string = "home";

  constructor(public model: AppService, public locationStrategy: LocationStrategy) { }

  ngOnInit() {
  }

  @ViewChild('usaNavOpen', { static: true }) openNavBtn: ElementRef;
  @ViewChild('usaNavClose', { static: true }) closeNavBtn: ElementRef;
  mobileNavActive = false;


  // When the mobile nav is active, and the close box isn't visible,
  // we know the user's viewport has been resized to be larger.
  // Let's make the page state consistent by deactivating the mobile nav.
  @HostListener('window:resize', ['$event'])
  onBrowserResize(event) {
    if (
      this.mobileNavActive &&
      this.closeNavBtn.nativeElement.getBoundingClientRect().width === 0
    ) {
      this.mobileNavActive = false;
    }
  }

  openMobileNav() {
    this.mobileNavActive = true;
  }

  closeMobileNav() {
    this.mobileNavActive = false;
    // The mobile nav was just deactivated, and focus was on the close
    // button, which is no longer visible. We don't want the focus to
    // disappear into the void, so focus on the menu button if it's
    // visible (this may have been what the user was just focused on,
    // if they triggered the mobile nav by mistake).
    this.openNavBtn.nativeElement.focus();
  }

  // The mobile nav was just activated, so focus on the close button,
  navAnimationEnd() {
    this.closeNavBtn.nativeElement.focus();
  }
}
