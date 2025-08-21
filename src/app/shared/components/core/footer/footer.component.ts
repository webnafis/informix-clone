import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BottomNavbarComponent } from './bottom-navbar/bottom-navbar.component';
import { FooterXlComponent } from './footer-xl/footer-xl.component';
import { SocialChatComponent } from "./social-chat/social-chat.component";
import { ShopInformation } from "../../../../interfaces/common/shop-information.interface";
import { Cart } from "../../../../interfaces/common/cart.interface";
import { SHOPINFORMATION_DB } from '../../../../core/shop-information.db';
import { CARTS_DB } from '../../../../core/cart.db';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    BottomNavbarComponent,
    FooterXlComponent,
    SocialChatComponent
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit, OnDestroy {
  // Decorator
  @Input() currentUrl: string;

  // Store Data
  carts: Cart[] = CARTS_DB;
  shopInfo: ShopInformation = SHOPINFORMATION_DB;
  chatLink: any = undefined;



  ngOnInit() {

  }

  /**
   * NG DESTROY
   */
  ngOnDestroy(): void {

  }
}
