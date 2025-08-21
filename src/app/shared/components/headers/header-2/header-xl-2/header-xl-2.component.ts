import { Component, HostListener, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { User } from '../../../../../interfaces/common/user.interface';
import { Cart } from '../../../../../interfaces/common/cart.interface';
import { Search2Component } from './search-2/search-2.component';
import { HeaderCart2Component } from './header-cart-2/header-cart-2.component';
import { ImgCtrlPipe } from "../../../../pipes/img-ctrl.pipe";

@Component({
  selector: 'app-header-xl-2',
  templateUrl: './header-xl-2.component.html',
  styleUrls: ['./header-xl-2.component.scss'],
  imports: [
    RouterLink,
    CommonModule,
    Search2Component,
    HeaderCart2Component,
    ImgCtrlPipe,
    NgOptimizedImage
  ],
  standalone: true
})
export class HeaderXl2Component implements OnInit, OnDestroy {



  // Decorator
  @Input() carts: Cart[] = [];
  @Input() cartAnimate: boolean = false;
  @Input() wishlistAnimate: boolean = false;
  @Input() shopInfo: any;

  // Store Data
  protected readonly rawSrcset: string = '384w, 640w';
  user: User;
  compareListV2: string[] | any[] = [];


  // Scroll
  isHeaderFixed: boolean = false;
  isHeaderTopHidden: boolean = false;


  // Inject
  private readonly router = inject(Router);





  ngOnInit() {

  }

  @HostListener('window:scroll')
  onScroll() {
    this.isHeaderTopHidden = window.scrollY > 250;
  }



  navigateToHome(): void {
    // Check if already on the home page
    if (this.router.url === '/') {
      // Reload the home page
      window.location.reload();
    } else {
      // Navigate to the home page
      this.router.navigate(['/']).then();
    }
  }



  /**
   * ON Destroy
   */
  ngOnDestroy() {

  }

}
