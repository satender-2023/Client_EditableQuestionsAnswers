import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllBlogsComponent } from './all-blogs/all-blogs.component';
import { BlogsByCategoryComponent } from './blogs-by-category/blogs-by-category.component';


const routes: Routes = [
  {path : '', component: AllBlogsComponent},
  {path : 'category', component : BlogsByCategoryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogsRoutingModule { }
