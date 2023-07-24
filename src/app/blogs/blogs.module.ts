import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogsRoutingModule } from './blogs-routing.module';
import { BlogsByCategoryComponent } from './blogs-by-category/blogs-by-category.component';

import { AllBlogsComponent } from './all-blogs/all-blogs.component';
import { AddBlogsComponent } from './add-blogs/add-blogs.component';




@NgModule({
  declarations: [BlogsByCategoryComponent,AllBlogsComponent, AddBlogsComponent],
  imports: [
    CommonModule,
    BlogsRoutingModule
  ]
})
export class BlogsModule { }
