import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Cart } from '../../../../../../interfaces/common/cart.interface';
import { RouterLink } from '@angular/router';
import { NgClass, } from '@angular/common';
import { Product } from "../../../../../../interfaces/common/product.interface";
import { ProductPricePipe } from '../../../../../pipes/product-price.pipe';
import { VariationInfoInlinePipe } from '../../../../../pipes/variation-info-inline.pipe';
import { EmptyDataComponent } from "../../../../ui/empty-data/empty-data.component";
import { CurrencyCtrPipe } from '../../../../../pipes/currency.pipe';

@Component({
  selector: 'app-header-cart-2',
  templateUrl: './header-cart-2.component.html',
  styleUrl: './header-cart-2.component.scss',
  imports: [
    RouterLink,
    NgClass,
    ProductPricePipe,
    VariationInfoInlinePipe,
    EmptyDataComponent,
    CurrencyCtrPipe,
  ],
  providers: [ProductPricePipe],
  standalone: true
})
export class HeaderCart2Component implements OnInit, OnDestroy {

  // Store Data
  @Input() carts: Cart[] = [];
  @Input() cartAnimate: boolean = false;
  currentUrl: string = '/';

  // Inject
  private readonly productPricePipe = inject(ProductPricePipe);


  ngOnInit() {

  }

  /**
   * Calculation
   * cartSubTotal()
   */

  get cartSubTotal(): number {
    return this.carts
      .map((t) => {
        return this.productPricePipe.transform(
          t.product as Product,
          'regularPrice',
          null,
          t.selectedQty
        ) as number;
      })
      .reduce((acc, value) => acc + value, 0);
  }

  getProductImage(item: any): string {
    return item?.variation?.image || item?.product?.images?.[0] || 'https://cdn.saleecom.com/upload/images/placeholder.png';
  }
  /**
   * On Destroy
   */
  ngOnDestroy() {

  }
}
