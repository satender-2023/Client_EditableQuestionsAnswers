import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GalleryComponent } from './gallery.component';
import { GalleryByCategoryComponent } from './gallery-by-category/gallery-by-category.component';


const routes: Routes = [
  {
    path:'',
    component: GalleryComponent
  },
  {
    path:'category/:categoryName',
    component: GalleryByCategoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GalleryRoutingModule { }
