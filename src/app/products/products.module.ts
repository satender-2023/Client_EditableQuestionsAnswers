import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductsRoutingModule } from './products-routing.module';
import { AddProductComponent } from './modals/add-product/add-product.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductDescriptionComponent } from './modals/product-description/product-description.component';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { SafeResourceUrlPipe } from './../pipes/safe-resource-url.pipe';
import { ConfirmOrderDetailsComponent } from './modals/confirm-order-details/confirm-order-details.component';
import { CategoryMenuModule } from '../partial_views/category-menu/category-menu.module';
import { AddCategoryModule } from './modals/add-category/add-category.module';


@NgModule({
  declarations: [
    ProductListComponent,
    AddProductComponent,
    ProductDescriptionComponent,
    SafeResourceUrlPipe,
    ConfirmOrderDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    ProductsRoutingModule,
    ReactiveFormsModule,
    CategoryMenuModule,
    AddCategoryModule,
    CarouselModule.forRoot()
  ]
})
export class ProductsModule { }
