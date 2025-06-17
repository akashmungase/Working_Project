import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/core/models/product.model';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  currentPage = 0;
  itemsPerPage = 10;
  totalItems = 0;

  constructor(private productService: ProductService) {
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    const offset = this.currentPage * this.itemsPerPage;
    this.productService.getProducts(offset, this.itemsPerPage)
      .subscribe((data: any) => {
        this.products = data;
        this.totalItems = 60;
      });
  }

  changePage(page: number) {
    this.currentPage = page;
    this.loadProducts();
  }
}
