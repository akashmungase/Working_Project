import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/core/services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  productsForm: FormGroup;
  submitted = false;
  categories: any[] = [];

  constructor(
    private productService: ProductService,
    private fb: FormBuilder
  ) {
    this.productsForm = this.fb.group({
      products: this.fb.array([this.createProductFormGroup()])
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }


  loadCategories() {
    this.productService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  get products(): FormArray {
    return this.productsForm.get('products') as FormArray;
  }

  createProductFormGroup(): FormGroup {
    return this.fb.group({
      title: [null, Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      description: [null, Validators.required],
      categoryId: [null, Validators.required],
      images: [[], Validators.required]
    });
  }

  addProduct(): void {
    this.products.push(this.createProductFormGroup());
  }

  removeProduct(index: number): void {
    this.products.removeAt(index);
  }

  onSubmit(): void {
    this.submitted = true;

    const payload = this.products.value.map((product: any) => {
      if (typeof product.images === 'string') {
        return { ...product, images: [product.images] };
      }
      return product;
    })

    this.productService.createProduct(payload[0]).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Product Added successfully!',
        });
        this.resetForm();
        this.submitted = false;
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error creating the product.',
        });
      }
    });

    //     const payload = this.products.value.map((product: any) => {
    //   if (typeof product.images === 'string') {
    //     return { ...product, images: [product.images] };
    //   }
    //   return product;
    // })
    // if (this.productsForm.valid) {

    //   for (let i = 0; i < payload.length; i++) {
    //     const element = payload[i];

    //     this.productService.createProduct(element).subscribe({
    //       next: () => {
    //         this.resetForm();
    //         this.submitted = false;
    //       },
    //     });

    //   }
    // }
  }

  resetForm(): void {
    this.submitted = false;
    this.products.clear();
    this.addProduct();
  }
}
