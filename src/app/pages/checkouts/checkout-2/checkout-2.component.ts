import {AfterViewInit, Component, inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule} from "@angular/forms";
import {Cart} from "../../../interfaces/common/cart.interface";
import {CART_MAX_QUANTITY} from "../../../core/utils/app-data";
import {User, UserAddress} from "../../../interfaces/common/user.interface";
import {DeliveryCharge, Setting} from "../../../interfaces/common/setting.interface";
import {Subscription} from "rxjs";
import {DOCUMENT, isPlatformBrowser} from "@angular/common";
import {CartService} from "../../../services/common/cart.service";
import {OrderService} from "../../../services/common/order.service";
import {ReloadService} from "../../../services/core/reload.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {UserDataService} from "../../../services/common/user-data.service";
import {UiService} from "../../../services/core/ui.service";
import {ProductPricePipe} from "../../../shared/pipes/product-price.pipe";
import {UserService} from '../../../services/common/user.service';
import {ProductService} from '../../../services/common/product.service';
import {MatDialog} from "@angular/material/dialog";
import {PaymentMethodComponent} from "../components/payment-method/payment-method.component";
import {TitleComponent} from "../../../shared/components/title/title.component";
import {OrderItemCardComponent} from "../../../shared/components/order-item-card/order-item-card.component";
import {
  OrderItemCardMobileComponent
} from "../../../shared/components/order-item-card-mobile/order-item-card-mobile.component";
import {UserOffersComponent} from "../components/user-offers/user-offers.component";
import {OffersComponent} from "../components/offers/offers.component";
import {DeliveryCharge2Component} from "./delivery-charge-2/delivery-charge-2.component";
import {AddressArea2Component} from "./address-area-2/address-area-2.component";
import {EmptyDataComponent} from "../../../shared/components/ui/empty-data/empty-data.component";
import {Coupon} from "../../../interfaces/common/coupon.interface";
import {CouponService} from '../../../services/common/coupon.service';
import {DiscountTypeEnum} from "../../../enum/product.enum";
import {GtmService} from '../../../services/core/gtm.service';
import {UtilsService} from '../../../services/core/utils.service';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {SettingService} from "../../../services/common/setting.service";
import {CurrencyCtrPipe} from "../../../shared/pipes/currency.pipe";
import {TranslatePipe} from "../../../shared/pipes/translate.pipe";
import {PayAdvanceComponent} from "../../../shared/dialog/pay-advance/pay-advance.component";
import {StorageService} from '../../../services/core/storage.service';
import {DATABASE_KEY} from '../../../core/utils/global-variable';

@Component({
  selector: 'app-easy-checkout',
  templateUrl: './checkout-2.component.html',
  styleUrl: './checkout-2.component.scss',
  providers: [ProductPricePipe],
  standalone: true,
  imports: [
    PaymentMethodComponent,
    TitleComponent,
    OrderItemCardComponent,
    OrderItemCardMobileComponent,
    ReactiveFormsModule,
    UserOffersComponent,
    OffersComponent,
    DeliveryCharge2Component,
    AddressArea2Component,
    EmptyDataComponent,
    RouterLink,
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    CurrencyCtrPipe,
    TranslatePipe,
  ]
})
export class Checkout2Component implements OnInit, AfterViewInit, OnDestroy {

  // Data Form
  dataForm?: FormGroup;
  @ViewChild('formElement') formElement: NgForm;
  @ViewChild(PaymentMethodComponent) paymentMethodComponent: PaymentMethodComponent;
  needRefreshForm: boolean = false;

  isHydrated = false;

  coupon: Coupon = null;
  couponCode: any = null;
  couponDiscount: number = 0;

  // Store Data
  private eventId: string;
  division: string;
  phoneNo: string = '';
  carts: Cart[] = [];
  readonly cartMaxQuantity: number = CART_MAX_QUANTITY;
  selectedCartItem: string = null;
  user: User;
  setting: Setting;
  deliveryCharge: DeliveryCharge;
  deliveryChargeAmount: number = 0;
  shippingAddress: any;
  selectedPaymentProvider: string;
  selectedPaymentProviderType: string;
  allPaymentProvider: any;
  advancePayment: any[] = [];
  note: string;
  deliveryNote: string;
  userOfferDiscount: any;
  deliveryOptionType: any;
  productSetting: any;
  incompleteOrderId: any;
  incompleteOrderData: any;
  affiliateSessionData: any;
  isEnableOrderNote: boolean;
  paymentInfoForm: FormGroup;

  // Loading
  isLoading: boolean = false;
  isCoupon: boolean = false;
  isIncompleteOrderId: boolean = false;

  // Subscriptions
  private subscriptions: Subscription[] = [];

  // Inject
  private readonly document = inject(DOCUMENT);
  private readonly cartService = inject(CartService);
  private readonly orderService = inject(OrderService);
  private readonly reloadService = inject(ReloadService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly userDataService = inject(UserDataService);
  private readonly uiService = inject(UiService);
  private readonly productPricePipe = inject(ProductPricePipe);
  protected readonly userService = inject(UserService);
  private readonly productService = inject(ProductService);
  private readonly dialog = inject(MatDialog);
  private readonly couponService = inject(CouponService);
  private readonly gtmService = inject(GtmService);
  private readonly utilsService = inject(UtilsService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly fb = inject(FormBuilder);
  private readonly settingService = inject(SettingService);
  private readonly storageService = inject(StorageService);


  ngOnInit() {

    // This Portion for Affiliate

    this.affiliateSessionData = JSON.parse(sessionStorage.getItem('affiliateSessionData') || '{}');
    // console.log('Saved Session:', this.affiliateSessionData);




    // Cart Data
    const subscription = this.reloadService.refreshCart$.subscribe(isRefresh => {
      if (isRefresh) {
        this.getCartsItems();
      }
    });
    this.subscriptions?.push(subscription);
    this.carts = this.cartService.cartItems;
    this.getCartsItems();

    this.activatedRoute.queryParamMap.subscribe((qParam) => {
      if (qParam.get('cart')) {
        this.selectedCartItem = qParam.get('cart');
      }
    });

    this.dataForm = this.fb.group({
      deliveryNote: ['']
    });

    // Base Data
    if (this.userService.isUser) {
      this.getLoggedInUserData();
    }
    this.getSetting();


  }

  /**
   * Hydrated Manage
   * checkHydrated()
   */

  protected checkHydrated() {
    if (isPlatformBrowser(this.platformId)) {
      this.isHydrated = true;
    }
  }

  ngAfterViewInit() {
    this.paymentInfoForm = this.paymentMethodComponent.getForm();
  }


  /**
   * HTTP Req Handle
   * getLoggedInUserData()
   * getPaymentMethod()
   * getCartsItems()
   * updateCartQty()
   * getSetting()
   */
  private getLoggedInUserData() {
    const select = 'email name phoneNo';
    const subscription = this.userDataService.getLoggedInUserData(select)
      .subscribe({
        next: (res) => {
          this.user = res.data;
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
          }, error: err => {
            console.log(err)
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
              // console.log(' this.carts ', this.carts)
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

  private updateCartQty(cartId: string, data: any) {
    const subscription = this.cartService.updateCartQty(cartId, data).subscribe({
      next: res => {
        if (res.success) {
          this.reloadService.needRefreshCart$(true);
        }
      },
      error: err => {
        console.log(err)
      }
    });
    this.subscriptions?.push(subscription);
  }

  private addOrder(data: any) {
    this.isLoading = true;
    const subscription = this.orderService.addOrder(data, this.userService.isUser).subscribe({
      next: (res) => {
        if (res.success) {
          this.isLoading = false;

          // Session Data Clear
          sessionStorage.removeItem('affiliateSessionData');
          switch (res.data.providerName) {
            case 'Cash on Delivery': {
              this.uiService.message(res.message, 'success');
              if (!this.userService.isUser) {
                this.cartService.deleteAllCartFromLocal(true);
              }
              this.router.navigate(['/success-order'], {
                queryParams: {orderId: res.data.orderId},
              }).then();
              this.cartService.needRefreshStoredCart$();
              break;
            }
            case 'Bkash': {
              if (res.data.providerType === 'api') {
                if (res.success && res.data.link) {
                  this.document.location.href = res.data.link;
                } else {
                  this.uiService.message(res.message, 'wrong');
                }
              } else {
                this.uiService.message(res.message, 'success');
                if (!this.userService.isUser) {
                  this.cartService.deleteAllCartFromLocal(true);
                }
                this.router.navigate(['/success-order'], {
                  queryParams: {orderId: res.data.orderId},
                }).then();
                this.cartService.needRefreshStoredCart$();
              }

              break;
            }
            case 'Nagad': {
              if (res.data.providerType === 'api') {
                if (res.success && res.data.link) {
                  this.document.location.href = res.data.link;
                } else {
                  this.uiService.message(res.message, 'wrong');
                }
              } else {
                this.uiService.message(res.message, 'success');
                if (!this.userService.isUser) {
                  this.cartService.deleteAllCartFromLocal(true);
                }
                this.router.navigate(['/success-order'], {
                  queryParams: {orderId: res.data.orderId},
                }).then();
                this.cartService.needRefreshStoredCart$();
              }

              break;
            }
            case 'Rocket': {
              if (res.data.providerType === 'api') {
                if (res.success && res.data.link) {
                  this.document.location.href = res.data.link;
                } else {
                  this.uiService.message(res.message, 'wrong');
                }
              } else {
                this.uiService.message(res.message, 'success');
                if (!this.userService.isUser) {
                  this.cartService.deleteAllCartFromLocal(true);
                }
                this.router.navigate(['/success-order'], {
                  queryParams: {orderId: res.data.orderId},
                }).then();
                this.cartService.needRefreshStoredCart$();
              }

              break;
            }
            case 'SSl Commerz': {
              if (res.data.providerType === 'api') {
                if (res.success && res.data.link) {
                  this.document.location.href = res.data.link;
                } else {
                  this.uiService.message(res.message, 'wrong');
                }
              } else {
                this.uiService.message(res.message, 'success');
                if (!this.userService.isUser) {
                  this.cartService.deleteAllCartFromLocal(true);
                }
                this.router.navigate(['/success-order'], {
                  queryParams: {orderId: res.data.orderId},
                }).then();
                this.cartService.needRefreshStoredCart$();
              }
              break;
            }
          }
        } else {
          this.uiService.message(res.message, 'warn');
        }

      },
      error: (error) => {
        console.log(error);
      },
    });
    this.subscriptions?.push(subscription);
  }

  private incompleteOrder() {

    const subscription = this.orderService.addIncompleteOrder(this.orderFinalData, this.userService.isUser).subscribe({
      next: (res) => {

        this.incompleteOrderId = res?.data?._id
        this.isIncompleteOrderId = true
        // console.log('success',res);
      },
      error: (error) => {
        console.log(error);
      },
    });
    this.subscriptions?.push(subscription);

  }


  updateIncompleteOrderById() {

    const subscription = this.orderService.updateIncompleteOrderById(this.incompleteOrderId, this.orderFinalData).subscribe({
      next: (res) => {
        if (res.success) {
          // console.log("update Incomplete Order");
        }
      },
      error: (err) => {
        console.error('Error fetching order:', err);
      }
    });
    this.subscriptions?.push(subscription);
  }

  private getSetting() {
    const subscription = this.settingService.getSetting('orderSetting advancePayment deliveryOptionType productSetting incompleteOrder')
      .subscribe({
        next: res => {
          this.isEnableOrderNote = res.data?.orderSetting?.isEnableOrderNote;
          this.deliveryOptionType = res.data?.deliveryOptionType;
          this.productSetting = res.data?.productSetting;
          this.incompleteOrderData = res.data?.incompleteOrder;
          if (res.data?.advancePayment && res.data?.advancePayment.length) {
            this.advancePayment = res.data.advancePayment.filter(f => f.status === 'active');
          }

        },
        error: err => {
          console.log(err)
        }
      });
    this.subscriptions.push(subscription);
  }


  /**
   * UI Methods
   * onConfirmOrder()
   */
  public onConfirmOrder() {

    if (!this.carts.length) {
      this.uiService.message('Empty Cart! sorry your cart is empty.', "warn");
      this.router.navigate(['/']).then();
      return;
    }

    if (!this.selectedPaymentProvider) {
      this.uiService.message('Please select a payment method', "warn")
      return;
    }

    if (!this.shippingAddress || (this.shippingAddress && !this.shippingAddress.division)) {
      this.needRefreshForm = true;
      this.uiService.message('Please select your address', "warn")
      return;
    }


    if (this.productSetting?.productType === 'digitalProduct' && this.productSetting?.digitalProduct?.isEmailEnable) {
      const email = this.shippingAddress?.email;

      if (!email) {
        this.needRefreshForm = true;
        this.uiService.message('Please add your email', 'warn');
        return;
      }

      // Check if email format is invalid
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        this.needRefreshForm = true;
        this.uiService.message('Please enter valid your email', 'warn');
        return;
      }
    }


    if (!this.shippingAddress || (this.shippingAddress && !this.shippingAddress.phoneNo) || (this.shippingAddress && this.shippingAddress.phoneNo && (this.shippingAddress && this.shippingAddress.phoneNo.length < 11))) {
      this.needRefreshForm = true;
      this.uiService.message('Please add your phone number', "warn")
      return;
    }

    if (!this.shippingAddress || (this.shippingAddress && !this.shippingAddress.shippingAddress)) {
      this.needRefreshForm = true;
      this.uiService.message('Please add your full address', "warn")
      return;
    }

    if (this.selectedPaymentProviderType === 'sent-money' || this.selectedPaymentProviderType === 'payment') {
      if (this.paymentInfoForm.invalid) {
        this.paymentInfoForm.markAllAsTouched();
        this.uiService.message('Please enter your payment information', "warn")
        return;
      }
    }

    // Save data for pixel
    this.saveUserSomeDataToLocal();


    if (this.getAdvancePaymentAmount > 0) {
      this.openAdvancePaymentDialog();
    } else {

      // console.log("this.orderFinalData", this.orderFinalData)
      this.addOrder(this.orderFinalData);
      // Event & Data Layer
      if (isPlatformBrowser(this.platformId)) {
        setTimeout(() => {
          this.initiateCheckoutEvent();
        }, 100)
      }
    }


  }

  private saveUserSomeDataToLocal() {
    this.storageService.addDataToEncryptLocal(
      {
        phoneNo: this.shippingAddress.phoneNo,
        email: this.shippingAddress.email ? this.shippingAddress.email : (this.user?.email ?? null),
        division: this.shippingAddress.division,
        area: this.shippingAddress.area,
        zone: this.shippingAddress.zone,
        name: this.shippingAddress.name,
        userId: this.user?._id ?? this.shippingAddress.phoneNo,
      },
      DATABASE_KEY.userInfoForPixel
    )
  }


  private get orderFinalData() {
    const getCartOrProductIds = () => {
      if (this.userService.isUser) {
        return this.carts.map(m => m._id);
      } else {
        return this.carts.map(m => m.product['_id']);
      }
    }

    const cartData = () => {
      if (this.userService.isUser) {
        return [];
      } else {
        return this.carts.map(m => {
          return {
            ...m,
            ...{
              product: m.product['_id']
            }
          }
        })
      }
    }

   return {
      ...{
        user: this.user?._id ?? null,
        orderType: this.userService.isUser ? 'user' : 'anonymous',
        carts: getCartOrProductIds(),
        cartData: cartData(),
        name: this.shippingAddress.name,
        phoneNo: this.shippingAddress.phoneNo,
        email: this.shippingAddress.email ? this.shippingAddress.email : (this.user?.email ?? null),
        shippingAddress: this.shippingAddress.shippingAddress,
        division: this.shippingAddress.division,
        area: this.shippingAddress.area,
        orderFrom: 'Website',
        zone: this.shippingAddress.zone,
        addressType: this.shippingAddress?.addressType,
        providerName: this.selectedPaymentProvider,
        deliveryNote: this.dataForm?.get('deliveryNote')?.value ?? '',
        deliveryType: this.deliveryCharge?.type,
        userOffer: this.userOfferDiscount?.offerType,
        needSaveAddress: true,
        coupon: this.coupon ? this.coupon?._id : null,
        providerType: this.selectedPaymentProviderType,
        incompleteOrderId: this.incompleteOrderId ?? null,
        affiliateId: this.affiliateSessionData ? this.affiliateSessionData.affiliateId : null,
        affiliateProductId: this.affiliateSessionData ? this.affiliateSessionData.affiliateProductId : null,
      },
      ...this.paymentInfoForm.value
    }
  }


  private get getAdvancePaymentAmount(): number {
    const hasValidProvider = (providers: any[]) => {
      const validProviders = ['Bkash', 'Nagad', 'Rocket', 'SSl Commerz'];
      return providers.some(provider => validProviders.includes(provider.providerName));
    }

    if (!hasValidProvider(this.allPaymentProvider?.paymentMethods ?? [])) {
      return 0
    }


    if (this.advancePayment && this.advancePayment.length && this.selectedPaymentProvider === 'Cash on Delivery') {

      // Find the custom_advance_payment object
      const customAdvance = this.advancePayment.find(
        item =>
          item.providerName === "custom_advance_payment" &&
          item.status === "active" &&
          this.cartSaleSubTotal >= item.minimumAmount
      );

      // If custom_advance_payment meets criteria, return its advancePaymentAmount
      if (customAdvance) {
        return customAdvance.advancePaymentAmount ?? 0;
      }

      // Else, check for advance_delivery_payment and matching division
      const deliveryAdvance = this.advancePayment.find(
        item =>
          item.providerName === "advance_delivery_payment" &&
          item.status === "active" &&
          item.division &&
          item.division.includes(this.shippingAddress.division)
      );

      if (deliveryAdvance) {
        return this.deliveryChargeAmount;
      }

      // If none match, return 0
      return 0;
    } else {
      return 0;
    }

  }


  /**
   * ON Change Methods
   * onChangeAddress()
   * onChangeDeliveryCharge()
   * onChangePaymentMethod()
   * onChangeUserDiscount()
   */
  // onChangeAddress(event: UserAddress) {
  //   this.shippingAddress = event;
  //   this.division = this.shippingAddress.division;
  //   console.log("eeeeeee",event)
  //
  //   let phoneNo :string
  //
  //
  //   if ( this.incompleteOrderData?.isEnableIncompleteOrder &&  event?.phoneNo && typeof event.phoneNo === 'string' && event.phoneNo.length === 11 && (phoneNo !==event.phoneNo)) {
  //     // Valid 11-digit phone number
  //     phoneNo = event.phoneNo;
  //     console.log('phoneNo',phoneNo)
  //     console.log('yes')
  //     this.incompleteOrder()
  //   }
  //
  //
  //
  //
  // }


  onChangeAddress(event: UserAddress): void {
    this.shippingAddress = event;
    this.division = event.division;
    // console.log('eeeeeee', event);
    // console.log('this.incompleteOrderData', this.incompleteOrderData);

    const isIncompleteOrderEnabled = this.incompleteOrderData?.isEnableIncompleteOrder;
    const isPhoneValid = typeof event?.phoneNo === 'string' && event.phoneNo.length === 11;
    const isPhoneChanged = this.phoneNo !== event.phoneNo;

    if (isIncompleteOrderEnabled && isPhoneValid && isPhoneChanged && !this.isIncompleteOrderId) {
      // console.log('eeeeeee', event);
      this.phoneNo = event.phoneNo;
      this.incompleteOrder();
    } else {

      if (isIncompleteOrderEnabled && isPhoneValid && isPhoneChanged && this.incompleteOrderId && this.isIncompleteOrderId) {
        this.phoneNo = event.phoneNo;
        // console.log('yes')
        this.updateIncompleteOrderById()
      }

    }
  }


  onChangeDeliveryCharge(event: DeliveryCharge) {
    this.deliveryCharge = event;
    // this.deliveryChargeAmount = event.deliveryCharge ?? 0;
    this.updateDeliveryChargeAmount();
  }

  updateDeliveryChargeAmount() {
    this.deliveryChargeAmount =
      this.deliveryCharge?.freeDeliveryMinAmount && this.cartSaleSubTotal >= this.deliveryCharge.freeDeliveryMinAmount
        ? 0
        : this.deliveryCharge?.deliveryCharge ?? 0;
  }

  onChangePaymentMethod(event: any) {
    this.selectedPaymentProvider = event;
  }

  onChangePaymentType(event: any) {
    this.selectedPaymentProviderType = event;
  }

  allPaymentMethod(event: any) {
    this.allPaymentProvider = event;
  }

  onChangeUserDiscount(event: any) {
    this.userOfferDiscount = event;
  }

  /**
   * Cart Methods
   * onIncrementQty()
   * onDecrementQty()
   */
  onIncrementQty(cartId: string, index: number) {
    if (this.userService.isUser) {
      if (this.carts[index].selectedQty === this.cartMaxQuantity) {
        this.uiService.message(`Maximum product quantity is ${this.cartMaxQuantity}`, 'warn');
      } else {
        this.carts[index].selectedQty += 1;
        this.updateCartQty(cartId, {selectedQty: 1, type: 'increment'});
      }
    } else {
      const data = this.cartService.getCartItemFromLocalStorage();
      if (data && data[index].selectedQty !== this.cartMaxQuantity) {
        data[index].selectedQty += 1;
        this.carts[index].selectedQty += 1;
        this.cartService.updateCartItemFromLocalStorage(data);
      }
    }
    this.updateDeliveryChargeAmount();
  }

  onDecrementQty(cartId: string, index: number, sQty: number) {
    if (this.userService.isUser) {
      if (sQty === 1) {
        this.uiService.message('Minimum quantity is 1', 'warn');
      } else {
        this.carts[index].selectedQty -= 1;
        this.updateCartQty(cartId, {selectedQty: 1, type: 'decrement'});
      }
    } else {
      const data = this.cartService.getCartItemFromLocalStorage();
      if (data && data[index].selectedQty !== 1) {
        data[index].selectedQty -= 1;
        this.carts[index].selectedQty -= 1;
        this.cartService.updateCartItemFromLocalStorage(data);
      }
    }
    this.updateDeliveryChargeAmount();
  }

  /**
   * Calculation
   * cartRegularSubTotal()
   * cartSaleSubTotal()
   * cartDiscountAmount()
   */

  get cartRegularSubTotal(): number {
    return this.carts.map(item => {
      return this.productPricePipe.transform(
        item.product,
        'regularPrice',
        item.variation?._id,
        item.selectedQty
      ) as number;
    }).reduce((acc, value) => acc + value, 0);
  }

  get cartSaleSubTotal(): number {
    return this.carts.map(item => {
      return this.productPricePipe.transform(
        item.product,
        'salePrice',
        item.variation?._id,
        item.selectedQty,
        item?.isWholesale
      ) as number;
    }).reduce((acc, value) => acc + value, 0);
  }

  get cartDiscountAmount(): number {
    return this.carts.map(item => {
      return this.productPricePipe.transform(
        item.product,
        'discountAmount',
        item.variation?._id,
        item.selectedQty,
        item?.isWholesale
      ) as number;
    }).reduce((acc, value) => acc + value, 0);
  }

  get grandTotal(): number {
    return this.cartSaleSubTotal + (this.deliveryChargeAmount ?? 0) - (this.userOfferDiscount?.amount ?? 0) - (this.couponDiscount ?? 0);
  }


  /**
   * Dialog View
   * openPopupDialog()
   */

  openAdvancePaymentDialog() {
    const dialogRef = this.dialog.open(PayAdvanceComponent, {
      maxWidth: "900px",
      width: "100%",
      height: "100%",
      maxHeight: "650px",

      data: {
        paymentProviders: this.allPaymentProvider?.paymentMethods ?? [],
        amount: this.getAdvancePaymentAmount,
      },
    });
    const subscription = dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        const mData = {
          ...this.orderFinalData,
          ...dialogResult,
          ...{
            advancePayment: this.getAdvancePaymentAmount
          }
        }
        this.addOrder(mData);
        // Event & Data Layer
        if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => {
            this.initiateCheckoutEvent();
          }, 100)
        }
      }

    });
    this.subscriptions?.push(subscription);
  }


  /**
   * COUPON HANDLE
   * checkCouponAvailability()
   * calculateCouponDiscount()
   * onRemoveCoupon()
   */

  public checkCouponAvailability() {
    if (!this.couponCode?.trim()) {
      this.uiService.message('Please enter your vouchers code.', "warn");
      return;
    }

    const subscription = this.couponService
      .checkCouponAvailability({
        couponCode: this.couponCode,
        subTotal: this.cartSaleSubTotal,
      })
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.uiService.message(res.message, 'success');
            this.coupon = res.data;

            if (this.coupon) {
              this.calculateCouponDiscount();
            }
          } else {
            this.uiService.message(res.message, "warn");
          }
        },
        error: (error) => {
          console.log(error);
        },
      });
    this.subscriptions?.push(subscription);
  }

  private calculateCouponDiscount() {
    if (this.coupon.discountType === DiscountTypeEnum.PERCENTAGE) {
      this.couponDiscount = Math.floor(
        (this.coupon.discountAmount / 100) * this.cartSaleSubTotal
      );
    } else {
      this.couponDiscount = Math.floor(this.coupon.discountAmount);
    }
  }


  onRemoveCoupon() {
    this.couponDiscount = 0
    this.couponCode = null;
    this.coupon = null;

  }


  /**
   * Utils
   * generateEventId()
   */
  private generateEventId() {
    this.eventId = this.utilsService.generateEventId();
  }

  private initiateCheckoutEvent(): void {
    // 1️⃣ Generate Unique Event ID
    this.generateEventId();

    // 2️⃣ Get hashed user data
    const user_data = this.utilsService.getUserData({
      email: this.userService.getUserLocalDataByField('email'),
      phoneNo: this.userService.getUserLocalDataByField('phoneNo'),
      external_id: this.userService.getUserLocalDataByField('userId'),
      lastName: this.userService.getUserLocalDataByField('name'),
      city: this.userService.getUserLocalDataByField('division'),
    });

    // 3️⃣ Prepare custom_data
    const custom_data = {
      content_ids: this.carts.map(m => m.product['_id']),
      value: this.grandTotal,
      num_items: this.carts.length,
      currency: 'BDT',
    };

    // 4️⃣ Server-side payload for CAPI
    const trackData: any = {
      event_name: 'InitiateCheckout',
      event_time: Math.floor(Date.now() / 1000),
      event_id: this.eventId,
      action_source: 'website',
      event_source_url: location.href,
      custom_data,
      ...(Object.keys(user_data).length > 0 && {user_data}),
    };

    // 5️⃣ Browser: Facebook Pixel (if not managed via GTM)
    if (!this.gtmService.isManageFbPixelByTagManager) {
      this.gtmService.trackByFacebookPixel('InitiateCheckout', custom_data, this.eventId);
    }

    // 6️⃣ Browser: GTM dataLayer push
    if (this.gtmService.isManageFbPixelByTagManager) {
      this.gtmService.pushToDataLayer({
        event: 'InitiateCheckout',
        event_id: this.eventId,
        page_url: window.location.href,
        ecommerce: {
          checkout: {
            actionField: {
              num_items: this.carts.length,
            },
            products: this.carts.map(m => ({
              id: m.product['_id'],
              name: m.product['name'],
              category: m.product['category']?.['name'],
              price: m.product['salePrice'],
              quantity: m.selectedQty,
            })),
          }
        }
      });
    }

    // 7️⃣ Server: Send to Conversions API
    this.gtmService.trackInitiateCheckout(trackData).subscribe({
      next: () => {
      },
      error: () => {
      },
    });
  }


  onSelectCouponOpen() {
    this.isCoupon = true;
  }

  onSelectCouponClose() {
    this.isCoupon = false;
  }


  /**
   * On Destroy
   */
  ngOnDestroy() {
    this.subscriptions?.forEach(sub => sub?.unsubscribe());
  }


}
