import { Component, HostListener, inject, Input, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ShopInformation } from "../../../../../interfaces/common/shop-information.interface";
import { NgClass } from "@angular/common";
import { Cart } from "../../../../../interfaces/common/cart.interface";

@Component({
  selector: 'app-bottom-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgClass,
  ],
  templateUrl: './bottom-navbar.component.html',
  styleUrl: './bottom-navbar.component.scss',
})
export class BottomNavbarComponent implements OnInit {

  // Decorator
  @Input() currentUrl: string;
  @Input() shopInfo: ShopInformation;
  @Input() chatLink: any;
  @Input() carts: Cart[] = [];
  protected readonly rawSrcset: string = '384w, 640w';

  // Store Data
  chatStyle: boolean = false;

  // Inject
  private readonly router = inject(Router);

  ngOnInit() {
    // console.log("this.carts", this.carts);
  }

  /**
   * Getter for total cost
   */
  get totalCost(): number {
    return this.carts.reduce((total, item) => {
      const qty = item.selectedQty || 0;
      const price = item.product?.salePrice || 0;
      return total + (qty * price);
    }, 0);
  }

  /**
   * Other Methods
   * isVisible
   * getSocialLink()
   * onClick()
   * chatOpen()
   **/
  get isVisible() {
    return !['/cart', '/checkout', '/easy-checkout'].includes(this.currentUrl);
  }

  getSocialLink(type: string): any {
    switch (type) {
      case 'messenger':
        return this.chatLink?.find(f => f.chatType === 'messenger') ?? null;
      case 'whatsapp':
        return this.chatLink?.find(f => f.chatType === 'whatsapp') ?? null;
      case 'phone':
        return this.chatLink?.find(f => f.chatType === 'phone') ?? null;
      default:
        return null;
    }
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!(event.target as HTMLElement).closest('.chat')) {
      this.chatStyle = false;
    }
  }

  chatOpen() {
    this.chatStyle = !this.chatStyle;
  }


  navigateToHome(): void {
    // Check if already on the home page
    if (this.router.url === '/') {
      // Reload the home page
      window.location.reload();
    } else {
      // Navigate to the home page
      this.router.navigate(['/']).then();
    }
  }
}
