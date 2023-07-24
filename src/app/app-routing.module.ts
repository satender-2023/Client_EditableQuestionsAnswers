import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

let routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: 'full'
  },
  {
    path: "notes",
    loadChildren: () => import('./notes-feature/notes-feature.module').then(m => m.NotesFeatureModule)
  },
  {
    path: "login",
    loadChildren: () => import('./admin-panel/admin-panel.module').then(m => m.AdminPanelModule)
  },
  {
    path: "products",
    loadChildren: () => import('./products/products.module').then(m => m.ProductsModule)
  },
  {
    path: "home",
    loadChildren: () => import('./landing-page/landing-page.module').then(m => m.LandingPageModule)
  },
  {
    path: "carts",
    loadChildren: () => import('./cart/cart.module').then(m => m.CartModule)
  },
  {
    path: "orders",
    loadChildren: () => import('./order/order.module').then(m => m.OrderModule)
  },
  {
    path: "gallery",
    loadChildren: () => import('./gallery/gallery.module').then(m => m.GalleryModule)
  },
  {
    path: "blogs",
    loadChildren: () => import('./blogs/blogs.module').then(mod => mod.BlogsModule)
  }
]
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [RouterModule]

})
export class AppRoutingModule { }
