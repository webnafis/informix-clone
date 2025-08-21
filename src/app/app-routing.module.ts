import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const baseRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    data: { preloadAfter: null },
  },
];



@NgModule({
  imports: [
    RouterModule.forRoot(baseRoutes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {


}
