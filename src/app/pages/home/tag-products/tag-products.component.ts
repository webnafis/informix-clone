import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { TimeCounterModule } from "../../../shared/components/time-counter/time-counter.module";
import { RouterLink } from "@angular/router";
import { ProductCard1Component } from "../../../shared/components/product-cards/product-card-1/product-card-1.component";
import { ProductCardLoaderComponent } from "../../../shared/loader/product-card-loader/product-card-loader.component";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";


@Component({
  selector: 'app-tag-products',
  templateUrl: './tag-products.component.html',
  styleUrl: './tag-products.component.scss',
  standalone: true,
  imports: [
    TimeCounterModule,
    RouterLink,
    ProductCard1Component,
    ProductCardLoaderComponent,
  ]
})
export class TagProductsComponent implements OnInit, OnDestroy {

  // Decorator
  @Input() tag: any;
  @Input() products: any[];
  @Input() index: number = 0;

  // Store Data
  // products: any;
  visibleProducts = 5;

  // Theme Views
  productCardViews: string = 'Product Card 1';

  // Loading
  isLoading: boolean = false;

  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 10;

  // Inject
  private readonly breakpointObserver = inject(BreakpointObserver);



  ngOnInit() {
    // Theme Base


    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      if (result.matches) {
        this.visibleProducts = 6; // Show 6 items on mobile
      } else {
        this.visibleProducts = 5; // Show 5 items on desktop
      }
    });

  }

  ngOnDestroy() {

  }

}
