import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { CustomPreloadingStrategy } from './core/utils/custom-preloading.strategy';
import { AppConfigService } from './services/core/app-config.service';
import { PageViewSetting } from './interfaces/common/setting.interface';

const baseRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    data: { preloadAfter: null },
  },
];


const wildcardRoute: Routes = [
  {
    path: '**',
    redirectTo: '',
  },
];


@NgModule({
  imports: [
    RouterModule.forRoot(baseRoutes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      preloadingStrategy: CustomPreloadingStrategy,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
  constructor(
    private appConfigService: AppConfigService,
    private router: Router
  ) {
    this.listenForConfigChanges();
  }

  private listenForConfigChanges() {
    this.appConfigService.config$.subscribe((config) => {
      if (config) {
        this.updateDynamicRoutes(config);
      }
    });
  }

  private updateDynamicRoutes(config: any) {
    const pageViewSettings: PageViewSetting[] = config.pageViewSettings ?? [];
    const pageOpt = pageViewSettings.find((f) => f.type === 'checkout');



    this.router.resetConfig([...baseRoutes, ...wildcardRoute]);
    // console.log('✅ Dynamic routes updated:', this.router.config);
  }
}
