import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withNoHttpTransferCache } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NgOptimizedImage, provideImgixLoader } from '@angular/common';
import { environment } from '../environments/environment';
import { FooterComponent } from './shared/components/core/footer/footer.component';
import { BottomNavbarComponent } from './shared/components/core/footer/bottom-navbar/bottom-navbar.component';
import { provideLottieOptions } from 'ngx-lottie';
import { Header2Component } from './shared/components/headers/header-2/header-2.component';
import { ArrayToSingleImagePipe } from "./shared/pipes/array-to-single-image.pipe";
import { ImgCtrlPipe } from "./shared/pipes/img-ctrl.pipe";
import { CurrencyCtrPipe } from './shared/pipes/currency.pipe';
import { ProductPricePipe } from "./shared/pipes/product-price.pipe";
import { FormsModule } from "@angular/forms";
import { MatIcon } from "@angular/material/icon";
import { EmptyDataComponent } from "./shared/components/ui/empty-data/empty-data.component";




@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    Header2Component,
    BottomNavbarComponent,
    FooterComponent,
    ArrayToSingleImagePipe,
    ImgCtrlPipe,
    NgOptimizedImage,
    CurrencyCtrPipe,
    ProductPricePipe,
    FormsModule,
    MatIcon,
    EmptyDataComponent,
  ],
  providers: [
    provideClientHydration(withNoHttpTransferCache()),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    provideImgixLoader(environment.ftpPrefixPath),
    provideLottieOptions({
      player: () => import('lottie-web'),
    }),
  ],

  bootstrap: [AppComponent]
})


export class AppModule {
}
