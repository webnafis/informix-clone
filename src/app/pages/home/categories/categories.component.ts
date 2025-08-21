import { Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Category } from '../../../interfaces/common/category.interface';
import { RouterLink } from '@angular/router';
import { CategoriesCardComponent } from '../../../shared/components/categories-card/categories-card.component';
import { CategoryLoaderComponent } from '../../../shared/loader/category-loader/category-loader.component';
import { CATEGORIES_DB } from '../../../core/categories.db';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  standalone: true,
  imports: [
    RouterLink,
    CategoriesCardComponent,
    CategoryLoaderComponent,
  ],
})
export class CategoriesComponent implements OnInit, OnDestroy {
  // Store Data
  categories: Category[];

  isLoading: boolean = true;
  categoryViews: string = 'Category 1';

  // Inject
  // Inject
  private readonly platformId = inject(PLATFORM_ID)




  ngOnInit(): void {
    // Theme Settings Handle
    if (isPlatformBrowser(this.platformId)) {
      this.categories = CATEGORIES_DB;

      this.isLoading = false;
    }



  }




  /**
   * On Destroy
   */
  ngOnDestroy() {

  }
}
