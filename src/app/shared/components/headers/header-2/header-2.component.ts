import { Component, inject, Input, OnDestroy, OnInit, PLATFORM_ID, Signal } from '@angular/core';
import { Cart } from '../../../../interfaces/common/cart.interface';
import { Wishlist } from "../../../../interfaces/common/wishlist.interface";
import { HeaderXl2Component } from './header-xl-2/header-xl-2.component';
import { HeaderSm2Component } from './header-sm-2/header-sm-2.component';
import { ShopInformation } from "../../../../interfaces/common/shop-information.interface";
import { isPlatformBrowser } from "@angular/common";
import { NewWishlistService } from "../../../../services/common/new-wishlist.service";
import { CARTS_DB } from '../../../../core/cart.db';
import { SHOPINFORMATION_DB } from '../../../../core/shop-information.db';

@Component({
  selector: 'app-header-2',
  standalone: true,
  imports: [
    HeaderXl2Component,
    HeaderSm2Component
  ],
  templateUrl: './header-2.component.html',
  styleUrl: './header-2.component.scss'
})
export class Header2Component implements OnInit, OnDestroy {

  // Decorator
  @Input() currentUrl: string;

  // Store Data
  carts: Cart[] = CARTS_DB;
  cartAnimate: boolean = false
  wishlistAnimate: boolean = false
  shopInfo: ShopInformation = SHOPINFORMATION_DB;
  toggleStyle: boolean = false;

  // Inject

  private readonly newWishlistService = inject(NewWishlistService);
  private readonly platformId = inject(PLATFORM_ID);

  // Wishlist Signal
  wishlists: Signal<Wishlist[]> = this.newWishlistService.newWishlistItems;



  ngOnInit() {


  }



  /**
   * x-icon
   * logo reload
   */
  setFavicon(iconPath: string) {
    if (isPlatformBrowser(this.platformId)) {
      const link: HTMLLinkElement = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = iconPath;
      document.getElementsByTagName('head')[0].appendChild(link);
    }
  }

  get isVisible() {

    return true;

  }
  /**
   * On Destroy
   */
  ngOnDestroy() {

  }

}
