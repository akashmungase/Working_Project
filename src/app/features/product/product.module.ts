import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule  } from '@angular/forms';
import { ProductRoutingModule } from './product-routing.module';
import { ProductListComponent } from './product-list/product-list.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    ProductListComponent,
    ProductDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ProductRoutingModule,
    ReactiveFormsModule,
    NgSelectModule
  ]
})
export class ProductModule { }
