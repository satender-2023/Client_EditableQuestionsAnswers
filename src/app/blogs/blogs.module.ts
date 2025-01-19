import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularEditorModule } from './../../lib/angular-editor.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { BlogsRoutingModule } from './blogs-routing.module';
import { BlogsByCategoryComponent } from './blogs-by-category/blogs-by-category.component';
import { BlogsComponent } from './blogs.component';
import { AddBlogsComponent } from './add-blogs/add-blogs.component';
import { SharedModule } from '../shared-module/shared.module';
import { BlogDetailsComponent } from './blog-details/blog-details.component';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    BlogsByCategoryComponent,
    BlogsComponent,
    AddBlogsComponent,
    BlogDetailsComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    BlogsRoutingModule,
    SharedModule,
    AngularEditorModule,
    HttpClientModule,
    NgxPaginationModule,
  ]
})
export class BlogsModule { }
