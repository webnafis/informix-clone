import { Component, HostListener, inject, Input } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Cart } from '../../../../../interfaces/common/cart.interface';

@Component({
  selector: 'app-header-sm-2',
  standalone: true,
  imports: [
    RouterLink,
  ],
  templateUrl: './header-sm-2.component.html',
  styleUrl: './header-sm-2.component.scss'
})
export class HeaderSm2Component {

  // Theme Settings
  searchHints: string[] = [
    "lipstick",
    "foundation",
    "face serum",
    "moisturizer",
    "lipstick",
    "lipstick"
  ];

  // Decorator
  @Input() currentUrl: string;
  @Input() carts: Cart[] = [];
  @Input() shopInfo: any;

  // Store Data
  protected readonly rawSrcset: string = '384w, 640w';
  isHeaderFixed: boolean = false;
  isHeaderTopHidden: boolean = false;


  ngOnInit() {


  }

  /**
   * Initial Landing Page Setting
   * getSettingData()
   */



  @HostListener('window:scroll')
  onScroll() {
    this.isHeaderFixed = window.scrollY > 0;
    this.isHeaderTopHidden = window.scrollY > 250;
  }


  get isVisible() {
    if (this.currentUrl === '/search') {
      return false;
    } else {
      return true;
    }
  }


}
