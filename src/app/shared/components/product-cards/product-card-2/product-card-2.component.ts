import {
  Component,
  computed,
  HostListener,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Signal,
  SimpleChanges
} from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { Subscription } from 'rxjs';
import { Cart } from '../../../../interfaces/common/cart.interface';
import { Product, VariationList } from '../../../../interfaces/common/product.interface';
import { Wishlist } from '../../../../interfaces/common/wishlist.interface';
import { CartService } from '../../../../services/common/cart.service';
import { UserService } from '../../../../services/common/user.service';
import { WishlistService } from '../../../../services/common/wishlist.service';
import { ReloadService } from '../../../../services/core/reload.service';
import { UiService } from '../../../../services/core/ui.service';
import { ImageLoadErrorDirective } from "../../../directives/image-load-error.directive";
import { ProductPricePipe } from '../../../pipes/product-price.pipe';
import { StarRatingViewComponent } from "../../star-rating-view/star-rating-view.component";
import {NewWishlistService} from "../../../../services/common/new-wishlist.service";
import {UtilsService} from "../../../../services/core/utils.service";
import {ViewContentService} from "../../../../services/common/view-content.service";
import {CurrencyCtrPipe} from '../../../pipes/currency.pipe';
import {TranslatePipe} from "../../../pipes/translate.pipe";

@Component({
  selector: 'app-product-card-2',
  standalone: true,
  imports: [
    RouterLink,
    ProductPricePipe,
    StarRatingViewComponent,
    ImageLoadErrorDirective,
    CurrencyCtrPipe,
    TranslatePipe
  ],
  templateUrl: './product-card-2.component.html',
  styleUrl: './product-card-2.component.scss'
})
export class ProductCard2Component implements OnInit, OnDestroy {

  // Decorator
  @Input() product: Product = null;
  image: any;
  zoomImage: any;
  prevImage: any;
  private eventId: string;
  /**
   * Usage Guide
   * sizes="(max-width: 599px) 16px, (min-width: 600px) 48px"
   * If with 16px then take the next src near 16w
   */
  protected readonly rawSrcset: string = '640w, 750w';

  // Store Data
  cart: any = null;
  carts: Cart[] = [];
  isModalVisible = false;

  // Variation Manage
  selectedVariation: string = null;
  selectedVariation2: string = null;
  selectedVariationList: VariationList = null;

  // Inject
  private readonly cartService = inject(CartService);
  private readonly newWishlistService = inject(NewWishlistService);
  private readonly userService = inject(UserService);
  private readonly uiService = inject(UiService);
  private readonly reloadService = inject(ReloadService);
  private readonly router = inject(Router);
  private readonly utilsService = inject(UtilsService);
  private readonly viewContentService = inject(ViewContentService);

  // Wishlist Signal
  wishlists: Signal<Wishlist[]> = this.newWishlistService.newWishlistItems;

  // Computed Wishlist Item (Find if product exists in wishlist)
  wishlist = computed(() => {
    return this.wishlists().find(f => {
      const productId = typeof f.product === 'string' ? f.product : f.product?._id;
      return productId === this.product?._id;
    });
  });

  // Subscriptions
  private subscriptions: Subscription[] = [];

  ngOnInit() {

    // Cart Base
    const subscription = this.cartService.refreshStoredCart$.subscribe(() => {
      this.carts = this.cartService.cartItems;
      this.checkCartList();
    });
    this.subscriptions?.push(subscription);
    this.carts = this.cartService.cartItems;

    if (this.userService.isUser) {
      // Fetch Wishlist from API
      this.newWishlistService.newGetWishlistByUser();
    }

    // Set Default Variation
    if (this.product?.isVariation) {
      this.setDefaultVariation();
      this.setDefaultImage();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.product?.isVariation) {
      this.setDefaultVariation();
      this.setDefaultImage();
    }
  }

  /**
   * Cart Manage
   * onAddToCart()
   * checkCartList()
   */

  onAddToCart(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    if (this.product?.isVariation && !this.isModalVisible) {
      this.isModalVisible = true;
      return;
    }

    const getVariationOption = () => {
      if (this.product?.variation && this.product.variation2) {
        return `${this.product?.variation}, ${this.product.variation2}`
      } else {
        return `${this.product?.variation}`
      }
    }

    const data: Cart = {
      product: this.product?._id,
      selectedQty: 1,
      isSelected: true,
      variation: this.selectedVariationList ? {
        _id: this.selectedVariationList?._id,
        name: this.selectedVariationList?.name,
        image: this.selectedVariationList?.image,
        option: getVariationOption(),
        sku: this.selectedVariationList?.sku,
      } : null
    };
    if (this.userService.isUser) {
      this.addToCartDB(data);
      this.viewEcommerceEvent('AddToCart');
    } else {
      this.cartService.addCartItemToLocalStorage(data);
      this.reloadService.needRefreshCart$(true);
      this.uiService.actionMessage('Success!', "success", '/cart', '/checkout' , 'local_mall', 'View Cart','Buy Now');
      this.isModalVisible = false;
      this.viewEcommerceEvent('AddToCart');
    }
  }

  checkCartList() {
    this.cart = this.carts.find(f => (f?.product as Product)?._id === this.product?._id);
  }


  /**
   * Wishlist Manage
   * onAddToWishlist()
   * checkWishlist()
   */
  onAddToWishlist(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    if (this.wishlist()) {
      this.newWishlistService.newDeleteWishlistById(this.wishlist()?._id);
    } else {
      const data: Wishlist | any = {
        product: this.product?._id,
        selectedQty: 1,
      };
      if (this.userService.isUser) {
        this.newWishlistService.newAddToWishlist(data);
        this.viewEcommerceEvent('Wishlist');
      } else {
        this.router.navigate(['/login']).then();
      }
    }
  }


  /**
   * HTTP REQ Handle
   * addToCartDB()
   * addToWishlistDB()
   * deleteWishlistById()
   */
  private addToCartDB(data: Cart) {
    const subscription = this.cartService.addToCart(data).subscribe({
      next: res => {
        this.uiService.actionMessage('Success!', "success", '/cart', '/checkout' , 'local_mall', 'View Cart','Buy Now');
        this.reloadService.needRefreshCart$(true);
        this.isModalVisible = false;
      },
      error: (error) => {
        console.log(error);
      },
    });
    this.subscriptions?.push(subscription);
  }

  /**
   * Variation Control
   * setDefaultVariation()
   * setSelectedVariationList()
   * onSelectVariation()
   * onSelectVariation2()
   * isStockAvailable()
   */
  private setDefaultVariation() {
    if (this.product?.variation) {
      this.selectedVariation = this.product?.variationOptions[0];
    }
    if (this.product?.variation2) {
      this.selectedVariation2 = this.product?.variation2Options[0];
    }
    // Selected Variation List
    this.setSelectedVariationList();

  }

  private setSelectedVariationList() {
    if (this.selectedVariation && this.selectedVariation2) {
      this.selectedVariationList = this.product?.variationList.find(
        f => f.name === `${this.selectedVariation}, ${this.selectedVariation2}`
      );
    } else {
      this.selectedVariationList = this.product?.variationList.find(f => f.name === `${this.selectedVariation}`)
    }
  }

  onSelectVariation(name: string) {
    if (this.selectedVariation !== name) {
      this.selectedVariation = name;
      if(this.convertToLowercase(this.product?.variation) === "color" || this.convertToLowercase(this.product?.variation) === "colour"){
        this.prevImage = this.image;
        let image = this.product?.variationList.find((v) => v?.name.toLowerCase().indexOf(name.toLowerCase()) > -1).image;
        this.image = image && image.length > 0 ? image : this.prevImage;
        }
      this.setSelectedVariationList();
    }
  }

  onSelectVariation2(name: string) {
    if (this.selectedVariation2 !== name) {
      this.selectedVariation2 = name;
      if(this.convertToLowercase(this.product?.variation2) === "color" || this.convertToLowercase(this.product?.variation2) === "colour"){
        let image = this.product?.variationList.find((v) => v?.name.toLowerCase().indexOf(name.toLowerCase()) > -1 && v?.name.toLowerCase().indexOf(this.selectedVariation.toLowerCase()) > -1).image;
        this.image = image && image.length > 0 ? image : this.prevImage;
      }
      this.setSelectedVariationList();
    }
  }

  convertToLowercase(inputString: string): string {
    return inputString?.toLowerCase()?.trim();
  }

  closeModal() {
    this.isModalVisible = false;
  }
  getVariationImage(name: string): string | undefined {
    return this.product?.variationList.find(
      (v) => v?.name.toLowerCase().includes(name.toLowerCase())
    )?.image;
  }

  /**
   MODAL HANDLE METHOD
   * setDefaultImage()
   */

  private setDefaultImage() {
    this.image =
      this.product?.images && this.product?.images?.length > 0
        ? this.product?.images[0]
        : 'https://cdn.saleecom.com/upload/images/placeholder.png';
    this.zoomImage = this.image;
  }

  /**
   * Calculate
   * ratingCount()
   */
  get ratingCount(): number {
    if (this.product) {
      return Math.floor((this.product?.ratingTotal ?? 0) / (this.product?.ratingCount ?? 0));
    } else {
      return 0;
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const modalContent = document.querySelector('.product-modal') as HTMLElement;

    if (this.isModalVisible && modalContent && !modalContent.contains(event.target as Node)) {
      this.closeModal();
    }
  }



  /**
   * Utils
   * generateEventId()
   */
  private generateEventId() {
    this.eventId = this.utilsService.generateEventId();
  }

  private viewEcommerceEvent(type:any): void {
    if (!this.product) {
      return;
    }
    // Generate Event Id
    this.generateEventId();
    const viewContentData: any = {
      event_name: type,
      event_time: Math.floor(Date.now() / 1000),
      event_id: this.eventId,
      custom_data: {
        content_id: this.product?._id,
        content_name: this.product?.name,
        content_category:  this.product?.category?.name,
        content_subcategory: this.product?.subCategory?.name,
        value: this.product?.salePrice ?? 0,
        currency: "BDT",
        quantity: 1,
      },
      email: this.userService.getUserEmail()  ?? null,
      phoneNo: this.userService.getUserPhoneNo() ?? null,
      pageUrl: 'event.urlAfterRedirects',
    };

    // Browser: Push simplified event data to the data layer
    this.viewContentService.pushToDataLayer({
      viewContentData
    });

    // Server: Track the full view content event
    this.viewContentService.trackEcommerceEvent(viewContentData);
  }

  /**
   * On Destroy
   */
  ngOnDestroy() {
    this.subscriptions?.forEach(sub => sub?.unsubscribe());
  }
}
