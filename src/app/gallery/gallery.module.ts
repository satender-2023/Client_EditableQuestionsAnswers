import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GalleryRoutingModule } from './gallery-routing.module';
import { GalleryComponent } from './gallery.component';
import { AddGalleryComponent } from './modals/add-gallery/add-gallery.component';
import { AddCategoryComponent } from './modals/add-category/add-category.component';
import { GalleryByCategoryComponent } from './gallery-by-category/gallery-by-category.component';
import { AddPhotosComponent } from './modals/add-photos/add-photos.component';
//import { AddCategoryComponent } from './modals/add-gallery/add-category.component';


@NgModule({
  declarations: [
    GalleryComponent, 
    AddGalleryComponent, AddCategoryComponent, GalleryByCategoryComponent, AddPhotosComponent, 
    //AddCategoryComponent
  ],
  imports: [
    CommonModule,
    GalleryRoutingModule
  ]
})
export class GalleryModule { }
