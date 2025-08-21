import { Component } from '@angular/core';
import { TimeCounterModule } from "../../shared/components/time-counter/time-counter.module";
import { Showcase3Component } from "./showcases/showcase-3/showcase-3.component";
import { CategoriesComponent } from "./categories/categories.component";
import { TagProductsComponent } from "./tag-products/tag-products.component";
import { FooterXlComponent } from "../../shared/components/core/footer/footer-xl/footer-xl.component";
import { ShopInformation } from "../../interfaces/common/shop-information.interface";
import { PRODUCTSBYCATEGORY_DB } from '../../core/products-by-category.db';
import { BrandsComponent } from '../../shared/components/brands/brands.component';
import { SHOPINFORMATION_DB } from '../../core/shop-information.db';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
  imports: [
    TimeCounterModule,
    Showcase3Component,
    CategoriesComponent,
    TagProductsComponent,
    FooterXlComponent,
    BrandsComponent,

  ]
})
export class HomeComponent {

  // Store data
  tagAndProducts: any[] = PRODUCTSBYCATEGORY_DB;
  shopInfo: ShopInformation = SHOPINFORMATION_DB;

  // Theme Settings
  showcaseViews: string = 'Showcase 3';

}
