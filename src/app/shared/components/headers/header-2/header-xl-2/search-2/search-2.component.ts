import { AfterViewInit, Component, ElementRef, inject, OnDestroy, PLATFORM_ID, ViewChild } from '@angular/core';
import { Product } from "../../../../../../interfaces/common/product.interface";
import { FormsModule, NgForm, ReactiveFormsModule } from "@angular/forms";
import {
  debounceTime,
  distinctUntilChanged,
  EMPTY,
  filter,
  map,
  Subject,
  Subscription,
  switchMap,
  takeUntil
} from "rxjs";
import { Router } from "@angular/router";
import { isPlatformBrowser, NgClass } from "@angular/common";
import { OutSideClickDirective } from "../../../../../directives/out-side-click.directive";
import { ProductPricePipe } from '../../../../../pipes/product-price.pipe';
import { CurrencyCtrPipe } from '../../../../../pipes/currency.pipe';
import { SPRODUCTS_DB } from '../../../../../../core/sproducts.db';

@Component({
  selector: 'app-search-2',
  templateUrl: './search-2.component.html',
  styleUrl: './search-2.component.scss',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    OutSideClickDirective,
    ProductPricePipe,
    CurrencyCtrPipe
  ],
  standalone: true
})
export class Search2Component implements AfterViewInit, OnDestroy {

  // Decorator
  @ViewChild('searchForm') searchForm: NgForm;
  @ViewChild('searchInput') searchInput: ElementRef;

  // Store Data
  searchProducts: Product[] = [];
  searchQuery = null;

  // Search View Control
  overlay = false;
  isOpen = false;
  isFocused = false;
  isLoading = false;



  // Placeholder Animation
  timeOutOngoing: any;
  char = 0;
  txt = 'Search products...';

  // Subscriptions
  private destroy$ = new Subject<void>();
  private subscriptions: Subscription[] = [];

  // Inject
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);


  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.searchAnim();
    }
    console.log("value changes? ", this.searchForm?.valueChanges);

    const subscription = this.searchForm?.valueChanges
      .pipe(
        map((t: any) => t['searchTerm']),
        filter(() => this.searchForm.valid),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((data) => {
          this.searchQuery = data?.trim();
          if (this.searchQuery === '' || this.searchQuery === null) {
            this.overlay = false;
            this.searchProducts = [];
            this.searchQuery = null;
            return EMPTY;
          }
          this.isLoading = true;
          return SPRODUCTS_DB;





        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: res => {
          this.isLoading = false;
          this.searchProducts = SPRODUCTS_DB.sort((a, b) => a.name.toLowerCase().indexOf(this.searchQuery.toLowerCase()) - b.name.toLowerCase().indexOf(this.searchQuery.toLowerCase()));
          if (this.searchProducts.length > 0) {
            this.isOpen = true;
            this.overlay = true;
          }
        },
        error: err => {
          this.isLoading = false;
          console.log(err);
        }
      });

    this.subscriptions?.push(subscription);
  }


  /**
   * Search Area Control
   * handleBlur()
   * onSearchNavigate()
   * handleFocus()
   * setPanelState()
   * handleOpen()
   * handleCloseAndClear()
   * onSelectItem()
   */

  handleBlur() {
    this.searchAnim();
    this.char = 0;
  }

  onSearchNavigate() {
    let inputVal = (this.searchInput.nativeElement as HTMLInputElement).value;
    if (inputVal) {
      this.router.navigate(['/']).then();
      this.searchInput.nativeElement.value = "";
      this.isOpen = false;
    }
  }

  handleFocus(event: FocusEvent): void {
    this.searchInput.nativeElement.focus();
    if (this.isFocused) {
      return;
    }
    if (this.searchProducts.length > 0) {
      this.setPanelState(event);
    }
    this.isFocused = true;
    let target = this.searchInput.nativeElement as HTMLInputElement;
    target.placeholder = '';
    clearInterval(this.timeOutOngoing);
  }

  private setPanelState(event: FocusEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.isOpen = false;
    this.handleOpen();
  }

  handleOpen(): void {
    if (this.isOpen || (this.isOpen && !this.isLoading)) {
      return;
    }
    if (this.searchProducts.length > 0) {
      this.isOpen = true;
      this.overlay = true;
    }
  }

  handleOutsideClick(): void {
    this.searchInput.nativeElement.value = '';
    if (!this.isOpen) {
      // this.isFocused = false;
      return;
    }
    this.isOpen = false;
    this.overlay = false;
    this.isFocused = false;
    this.searchProducts = [];
  }

  handleCloseAndClear(): void {
    if (!this.isOpen) {
      this.isFocused = false;
      return;
    }
    this.isOpen = false;
    this.overlay = false;
    this.searchProducts = [];
    this.isFocused = false;
  }

  onSelectItem(data: Product): void {
    this.searchInput.nativeElement.value = '';
    this.handleCloseAndClear();
    this.router.navigate(['/']).then();
  }

  /**
   * Search Input Animation
   * searchAnim()
   * typeIt()
   */
  private searchAnim() {
    const target = this.searchInput?.nativeElement as HTMLInputElement;
    target.placeholder = '|'; // Reset the placeholder to "|"
    this.char = 0; // Reset the character count to 0
    this.typeIt(target, 250); // Call the typing animation with a fixed delay (100ms)
  }

  private typeIt(target: HTMLInputElement, delay: number) {
    // Clear any previous timeouts to avoid overlapping animations
    clearTimeout(this.timeOutOngoing);

    this.timeOutOngoing = setTimeout(() => {
      // Increment the character count
      this.char++;

      // Get the substring based on the current character count
      const type = this.txt.substring(0, this.char);
      target.placeholder = type + '|'; // Update the placeholder with the typed text

      // If the entire text is typed, reset and start over
      if (this.char < this.txt.length) {
        this.typeIt(target, delay); // Continue typing
      } else {
        // Once the text is fully typed, reset to "|" and start over
        target.placeholder = '|';
        this.char = 0; // Reset the character count
        this.typeIt(target, delay); // Restart the typing animation
      }
    }, delay); // Use a constant delay to ensure consistent speed
  }





  /**
   * On Destroy
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.subscriptions?.forEach(sub => sub?.unsubscribe());
  }
}
