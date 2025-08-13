import {Component, HostListener, inject, Input} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {Cart} from '../../../../../interfaces/common/cart.interface';
import {NavigationService} from '../../../../../services/core/navigation.service';
import {ImgCtrlPipe} from '../../../../pipes/img-ctrl.pipe';
import {NgOptimizedImage} from '@angular/common';
import {AppConfigService} from '../../../../../services/core/app-config.service';

@Component({
  selector: 'app-header-sm-1',
  standalone: true,
  imports: [
    RouterLink,
    ImgCtrlPipe,
    NgOptimizedImage
  ],
  templateUrl: './header-sm-1.component.html',
  styleUrl: './header-sm-1.component.scss'
})
export class HeaderSm1Component {

  // Theme Settings
  searchHints: string[] = [];

  // Decorator
  @Input() currentUrl: string;
  @Input() carts: Cart[] = [];
  @Input() shopInfo: any;

  // Store Data
  protected readonly rawSrcset: string = '384w, 640w';
  isHeaderFixed: boolean = false;
  isHeaderTopHidden: boolean = false;

  // Inject
  private readonly appConfigService = inject(AppConfigService);
  private readonly navigationService = inject(NavigationService);
  private readonly router = inject(Router);

  ngOnInit() {
    // Theme Settings
    this.getSettingData();
  }

  /**
   * Initial Landing Page Setting
   * getSettingData()
   */

  private getSettingData() {
    const searchHintsSetting = this.appConfigService.getSettingData('searchHints');
    const baseResults = searchHintsSetting.split(',').map((item: string) => item.trim());
    this.searchHints = [...baseResults, baseResults[0]];
  }

  @HostListener('window:scroll')
  onScroll() {
    this.isHeaderFixed = window.scrollY > 0;
    this.isHeaderTopHidden = window.scrollY > 250;
  }


  get isVisible() {
    if (this.currentUrl === '/search') {
      return false;
    }else {
      return true;
    }
  }

  goBack(): void {
    const currentUrl = this.router.url;
    if (currentUrl === '/my-order-list') {
      this.router.navigate(['/my-account-sm']);
    } else {
      this.navigationService.back();
    }
  }
}
