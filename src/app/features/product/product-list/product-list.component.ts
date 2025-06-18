import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/core/services/product.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  currentPage = 0;
  itemsPerPage = 10;
  totalItems = 60;
  sortDirection: 'asc' | 'desc' | '' = '';

  filterForm: FormGroup;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.filterForm = this.fb.group({
      title: [null],
      categoryId: [null],
      priceMin: [null],
      priceMax: [null]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();

    this.filterForm.valueChanges
      .pipe(debounceTime(400))
      .subscribe(() => {
        this.currentPage = 0;
        this.loadProducts();
      });
  }

  loadProducts() {
    const offset = this.currentPage * this.itemsPerPage;
    const formValue = this.filterForm.value;

    this.productService.getProducts(
      offset,
      this.itemsPerPage,
      formValue.title,
      formValue.categoryId,
      formValue.priceMin,
      formValue.priceMax
    ).subscribe((data: any) => {
      this.products = data;
      this.sortProducts();
    });
  }

  loadCategories() {
    this.productService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  sortByPrice() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortProducts();
  }

  private sortProducts() {
    if (this.sortDirection === 'asc') {
      this.products.sort((a, b) => a.price - b.price);
    } else if (this.sortDirection === 'desc') {
      this.products.sort((a, b) => b.price - a.price);
    }
  }

  changePage(page: number) {
    this.currentPage = page;
    this.loadProducts();
  }

  resetFilters() {
    this.filterForm.reset();
    this.sortDirection = '';
    this.currentPage = 0;
    this.loadProducts();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  openProductDetails(Id: number) {
    this.router.navigate([`detail/${Id}`])
  }
}
