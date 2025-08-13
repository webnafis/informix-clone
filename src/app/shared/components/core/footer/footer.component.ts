import {Component, inject, Input, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {BottomNavbarComponent} from './bottom-navbar/bottom-navbar.component';
import {FooterXlComponent} from './footer-xl/footer-xl.component';
import {SocialChatComponent} from "./social-chat/social-chat.component";
import {isPlatformBrowser} from "@angular/common";
import {ShopInformationService} from "../../../../services/common/shop-information.service";
import {ShopInformation} from "../../../../interfaces/common/shop-information.interface";
import {Subscription} from "rxjs";
import {SettingService} from "../../../../services/common/setting.service";
import {Cart} from "../../../../interfaces/common/cart.interface";
import {CartService} from "../../../../services/common/cart.service";
import {ReloadService} from "../../../../services/core/reload.service";
import {UserService} from "../../../../services/common/user.service";
import {ProductService} from "../../../../services/common/product.service";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    BottomNavbarComponent,
    FooterXlComponent,
    SocialChatComponent
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements  OnInit, OnDestroy {
  // Decorator
  @Input() currentUrl: string;

  // Store Data
  carts: Cart[] = [];
  shopInfo: ShopInformation;
  chatLink: any;
  cartAnimate: boolean = false;

  // Subscriptions
  private subscriptions: Subscription[] = [];

  // Inject
  private readonly settingService = inject(SettingService);
  private readonly shopInfoService = inject(ShopInformationService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly cartService = inject(CartService);
  private readonly reloadService = inject(ReloadService);
  private readonly userService = inject(UserService);
  private readonly productService = inject(ProductService);


  ngOnInit() {
    // Reload Data
    const subscription = this.reloadService.refreshCart$.subscribe(isRefresh => {
      if (isRefresh) {
        this.getCartsItems(isRefresh);
      }
    });
    this.subscriptions?.push(subscription);
    // Base Data
    if (isPlatformBrowser(this.platformId)) {
      this.getShopInfo();
      this.getChatLink();
      this.getCartsItems();
    }
  }

  /**
   * HTTP REQUEST
   * getShopInfo()
   * getPaymentMethod()
   */

  private getShopInfo() {
    setTimeout(() => {
      const subscription = this.shopInfoService.getShopInformation().subscribe({
        next: res => {
          this.shopInfo = res.data;
        },
        error: err => {
          console.error(err);
        }
      });
      this.subscriptions?.push(subscription);
    }, 500); // 2 seconds delay
  }


  private getChatLink() {
    const subscription = this.settingService.getChatLink()
      .subscribe({
        next: (res) => {
          this.chatLink = res.data;
        },
        error: (error) => {
          console.log(error);
        },
      });
    this.subscriptions?.push(subscription);
  }

  private getCartsItems(refresh?: boolean) {
    if (this.userService.isUser) {
      const subscription = this.cartService.getCartByUser()
        .subscribe({
          next: res => {
            this.carts = res.data;
            this.cartService.updateCartList(this.carts);
            if (refresh) {
              this.cartAnimate = true;
              setTimeout(() => {
                if (this.cartAnimate == true) {
                  this.cartAnimate = false;
                }
              }, 1000);
            }
          },
          error: error => {
            console.log(error)
          }
        });
      this.subscriptions?.push(subscription);
    } else {
      this.getCarsItemFromLocal(refresh);
    }
  }

  private getCarsItemFromLocal(refresh?: boolean) {
    const items = this.cartService.getCartItemFromLocalStorage();

    if (items && items.length) {
      const ids: string[] = items.map((m) => m.product as string);
      const select =
        'name slug salePrice regularPrice images quantity category isVariation variationList minimumWholesaleQuantity wholesalePrice';
      const subscription = this.productService.getProductByIds(ids, select)
        .subscribe({
          next: res => {
            const products = res.data;
            this.removeUnnecessaryCartItems(products, ids);
            if (products && products.length) {
              this.carts = items.map(t1 => ({
                ...t1,
                ...{product: products.find((t2) => t2._id === t1.product)},
              }));
              this.cartService.updateCartList(this.carts);
              if (refresh) {
                this.cartAnimate = true;
                setTimeout(() => {
                  if (this.cartAnimate == true) {
                    this.cartAnimate = false;
                  }
                }, 1000);
              }
            }
          },
          error: error => {
            console.log(error)
          }
        });
      this.subscriptions?.push(subscription);
    } else {
      this.carts = [];
      this.cartService.updateCartList(this.carts);
    }
  }

  private removeUnnecessaryCartItems(products: any[], ids: string[]) {
    if (!this.userService.isUser) {
      const productIds = products.map(product => product._id);
      const notExistsIds = ids.filter(id => !productIds.includes(id));
      if (notExistsIds.length) {
        this.cartService.deleteCartItemFromLocalStorage(notExistsIds);
        this.reloadService.needRefreshCart$(true);
      }

    }
  }

  get isVisible() {
    if (this.currentUrl === '/offer') {
      return false;
    }  else if (this.currentUrl.includes('/landing-page/')) {
      return false;
    }else if (this.currentUrl.includes('/offer/')) {
      return false;
    }else {
      return true;
    }
  }

  /**
   * NG DESTROY
   */
  ngOnDestroy(): void {
    this.subscriptions?.forEach(subscription => subscription?.unsubscribe());
  }
}
