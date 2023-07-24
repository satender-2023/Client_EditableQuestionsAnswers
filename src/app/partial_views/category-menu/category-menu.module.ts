import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryMenuComponent } from './category-menu.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AddCategoryModule } from 'src/app/products/modals/add-category/add-category.module';
import { AccordionModule } from 'ngx-bootstrap/accordion';

@NgModule({
  declarations: [
    CategoryMenuComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    AddCategoryModule,
    AccordionModule.forRoot(),
  ],
  exports: [CategoryMenuComponent],
  entryComponents: [CategoryMenuComponent],
})
export class CategoryMenuModule { }
