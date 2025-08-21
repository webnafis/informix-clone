import { Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { BrandCardComponent } from './brand-card/brand-card.component';
import { CATEGORIES_DB } from '../../../core/categories.db';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss',
  standalone: true,
  imports: [
    BrandCardComponent,
  ],
})
export class BrandsComponent implements OnInit, OnDestroy {
  brandViews: string = 'Brand 1';
  brands: any[];
  isLoading = true;

  // Inject
  private readonly platformId = inject(PLATFORM_ID)



  ngOnInit(): void {
    // Theme Settings Handle
    if (isPlatformBrowser(this.platformId)) {
      this.brands = CATEGORIES_DB;
      // this.brandViews = ;
      this.isLoading = false;
    }


  }


  ngOnDestroy() {

  }
}
