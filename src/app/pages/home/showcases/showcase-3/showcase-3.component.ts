import { Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { CarouselComponent } from "../../../../shared/loader/carousel-loader/carousel-loader.component";
import { ImageSliderComponent } from "../../../../shared/components/image-slider/image-slider.component";
import { Carousel } from "../../../../interfaces/common/carousel.interface";
import { Category } from "../../../../interfaces/common/category.interface";
import { RouterLink } from "@angular/router";
import {
  ShowcaseThreeCategoryLoaderComponent
} from "../../../../shared/loader/showcase-three-category-loader/showcase-three-category-loader.component";
import { CAROUSEL_DB } from '../../../../core/carousel.db';
import { CATEGORIES_DB } from '../../../../core/categories.db';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-showcase-3',
  standalone: true,
  imports: [
    CarouselComponent,
    ImageSliderComponent,
    RouterLink,
    ShowcaseThreeCategoryLoaderComponent
  ],
  templateUrl: './showcase-3.component.html',
  styleUrl: './showcase-3.component.scss'
})
export class Showcase3Component implements OnInit, OnDestroy {

  // Store Data
  carousels: Carousel[];
  categories: Category[];
  isLoading: boolean = true;

  // Inject
  private readonly platformId = inject(PLATFORM_ID)



  ngOnInit(): void {
    // Theme Settings Handle
    if (isPlatformBrowser(this.platformId)) {
      this.categories = CATEGORIES_DB;
      this.carousels = CAROUSEL_DB;
      // this.brandViews = ;
      this.isLoading = false;
    }



  }





  /**
   * ON Destroy
   */
  ngOnDestroy() {
  }

}
