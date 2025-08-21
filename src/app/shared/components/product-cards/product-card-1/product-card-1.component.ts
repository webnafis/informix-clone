import {
  Component,
  computed,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Signal,
} from '@angular/core';
import { Product, VariationList } from '../../../../interfaces/common/product.interface';
import { Cart } from '../../../../interfaces/common/cart.interface';
import { Wishlist } from '../../../../interfaces/common/wishlist.interface';
import { RouterLink } from '@angular/router';
import { StarRatingViewComponent } from '../../star-rating-view/star-rating-view.component';
import { ProductPricePipe } from '../../../pipes/product-price.pipe';
import { ArrayToSingleImagePipe } from '../../../pipes/array-to-single-image.pipe';
import { ImgCtrlPipe } from '../../../pipes/img-ctrl.pipe';
import { NgOptimizedImage } from '@angular/common';
import { NewWishlistService } from "../../../../services/common/new-wishlist.service";
import { CurrencyCtrPipe } from '../../../pipes/currency.pipe';
import { CARTS_DB } from '../../../../core/cart.db';

@Component({
  selector: 'app-product-card-1',
  standalone: true,
  imports: [
    RouterLink,
    StarRatingViewComponent,
    ProductPricePipe,
    ArrayToSingleImagePipe,
    ImgCtrlPipe,
    NgOptimizedImage,
    CurrencyCtrPipe,
  ],
  templateUrl: './product-card-1.component.html',
  styleUrl: './product-card-1.component.scss'
})
export class ProductCard1Component implements OnInit, OnDestroy {

  // Decorator
  @Input() product: Product = null;
  image: any;
  zoomImage: any;
  prevImage: any;
  /**
   * Usage Guide
   * sizes="(max-width: 599px) 16px, (min-width: 600px) 48px"
   * If with 16px then take the next src near 16w
   */
  protected readonly rawSrcset: string = '640w, 750w';

  // Store Data
  cart: any = null;
  carts: Cart[] = CARTS_DB;
  isModalVisible = false;
  private eventId: string;

  // Variation Manage
  selectedVariation: string = null;
  selectedVariation2: string = null;
  selectedVariationList: VariationList = null;

  // Inject
  private readonly newWishlistService = inject(NewWishlistService);


  // Wishlist Signal
  wishlists: Signal<Wishlist[]> = this.newWishlistService.newWishlistItems;

  // Computed Wishlist Item (Find if product exists in wishlist)
  wishlist = computed(() => {
    return this.wishlists().find(f => {
      const productId = typeof f.product === 'string' ? f.product : f.product?._id;
      return productId === this.product?._id;
    });
  });



  ngOnInit() {

  }


  /**
   * Cart Manage
   * onAddToCart()
   * checkCartList()
   */

  onAddToCart(event: MouseEvent) {

  }




  /**
   * Wishlist Manage
   * onAddToWishlist()
   * checkWishlist()
   */
  onAddToWishlist(event: MouseEvent) {

  }




  /**
   * Variation Control
   * setDefaultVariation()
   * setSelectedVariationList()
   * onSelectVariation()
   * onSelectVariation2()
   * isStockAvailable()
   */




  convertToLowercase(inputString: string): string {
    return inputString?.toLowerCase()?.trim();
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





  /**
   * On Destroy
   */
  ngOnDestroy() {

  }
}
