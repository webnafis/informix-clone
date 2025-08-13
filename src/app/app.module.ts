import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule, provideClientHydration, withNoHttpTransferCache} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import {NgOptimizedImage, provideImgixLoader} from '@angular/common';
import {environment} from '../environments/environment';
import {Header1Component} from './shared/components/headers/header-1/header-1.component';
import {FooterComponent} from './shared/components/core/footer/footer.component';
import {BottomNavbarComponent} from './shared/components/core/footer/bottom-navbar/bottom-navbar.component';
import {authUserInterceptor} from './auth-interceptor/auth-user-interceptor';
import {provideLottieOptions} from 'ngx-lottie';
import {Header2Component} from './shared/components/headers/header-2/header-2.component';
import {ArrayToSingleImagePipe} from "./shared/pipes/array-to-single-image.pipe";
import {ImgCtrlPipe} from "./shared/pipes/img-ctrl.pipe";
import {PaymentCardLoaderComponent} from "./shared/loader/payment-card-loader/payment-card-loader.component";
import {TitleComponent} from "./shared/components/title/title.component";
import {AppConfigService} from './services/core/app-config.service';
import {CurrencyCtrPipe} from './shared/pipes/currency.pipe';
import {ProductPricePipe} from "./shared/pipes/product-price.pipe";
import {AccountSidebarComponent} from "./shared/components/account-sidebar/account-sidebar.component";
import {ButtonLoaderComponent} from "./shared/loader/button-loader/button-loader.component";
import {FormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {MobileHeaderComponent} from "./shared/components/core/mobile-header/mobile-header.component";
import {
  OrderDetailsProductsComponent
} from "./pages/order-details/order-details-products/order-details-products.component";
import {
  OrderDetailsShippingaddressComponent
} from "./pages/order-details/order-details-shippingaddress/order-details-shippingaddress.component";
import {
  OrderDetailsTimelineComponent
} from "./pages/order-details/order-details-timeline/order-details-timeline.component";
import {OrderLoaderComponent} from "./shared/loader/order-loader/order-loader.component";
import {ProfileLoaderComponent} from "./shared/loader/profile-loader/profile-loader.component";
import {
  ShippingAddressLoaderComponent
} from "./shared/loader/shipping-address-loader/shipping-address-loader.component";
import {TimelineLoaderComponent} from "./shared/loader/timeline-loader/timeline-loader.component";
import {EmptyDataComponent} from "./shared/components/ui/empty-data/empty-data.component";
import {SingleOrderComponent} from "./shared/components/single-order/single-order.component";

export function initConfig(configService: AppConfigService) {
  return () => configService.loadConfig();
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    Header1Component,
    Header2Component,
    BottomNavbarComponent,
    FooterComponent,
    ArrayToSingleImagePipe,
    ImgCtrlPipe,
    NgOptimizedImage,
    PaymentCardLoaderComponent,
    TitleComponent,
    CurrencyCtrPipe,
    ProductPricePipe,
    AccountSidebarComponent,
    ButtonLoaderComponent,
    FormsModule,
    MatIcon,
    MobileHeaderComponent,
    OrderDetailsProductsComponent,
    OrderDetailsShippingaddressComponent,
    OrderDetailsTimelineComponent,
    OrderLoaderComponent,
    ProfileLoaderComponent,
    ShippingAddressLoaderComponent,
    TimelineLoaderComponent,
    EmptyDataComponent,
    SingleOrderComponent,
  ],
  providers: [
    AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [AppConfigService],
      multi: true
    },
    provideClientHydration(withNoHttpTransferCache()),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    provideHttpClient(withInterceptors([authUserInterceptor])),
    provideImgixLoader(environment.ftpPrefixPath),
    provideLottieOptions({
      player: () => import('lottie-web'),
    }),
  ],

  bootstrap: [AppComponent]
})
export class AppModule {
}
