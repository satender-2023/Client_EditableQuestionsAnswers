import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlogsComponent } from './blogs.component';
import { BlogsByCategoryComponent } from './blogs-by-category/blogs-by-category.component';
import { BlogDetailsComponent } from './blog-details/blog-details.component';
import { AddBlogsComponent } from './add-blogs/add-blogs.component';


const routes: Routes = [
  { path: '', component: BlogsComponent },
  { path: 'add', component: AddBlogsComponent },
  { path: 'edit/:blogId', component: AddBlogsComponent },
  { path: 'category', component: BlogsByCategoryComponent },
  { path: ':blogId/:blogSlug', component: BlogDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogsRoutingModule { }
