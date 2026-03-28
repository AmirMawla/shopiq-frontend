// import { Component, inject } from '@angular/core';
// import { CategoriesS } from '../../../../services/category';
// import { Observable } from 'rxjs';
// import { Category } from '../../../../models/category';
// import { AsyncPipe, JsonPipe } from '@angular/common';
// import { Product } from '../../../../models/product';
// import { FormsModule } from '@angular/forms';
// import { ProductService } from '../../../../services/product';
// import { Router, ActivatedRoute } from '@angular/router';

// @Component({
//   selector: 'app-add-product',
//   imports: [AsyncPipe, FormsModule, JsonPipe],
//   templateUrl: './add-product.html',
//   styleUrl: './add-product.css',
// })
// export class AddProduct {
//   private categoriesService = inject(CategoriesS);
//   private productsService = inject(ProductService);
//   private router = inject(Router);

//   categories$: Observable<Category[]> = this.categoriesService.getAllCategories();
//   // product: Product = { images: [] } as Product;
//      product: Product = {} as Product;
//   isEdit = false;

//   submitProduct() {
//     console.log(this.product);

//     if (this.isEdit) {
//       this.productsService.updateProduct(this.product).subscribe({
//         next: (res) => {
//           alert('Product updated successfully');
//           // this.product = { images: [] } as Product;
//           this.router.navigateByUrl('/products');
//         },
//         error: (err) => {
//           console.log(err);
//           alert('Error updating product');
//         }
//       });
//     } else {
//       this.productsService.addNewProduct(this.product).subscribe({
//         next: (res) => {
//           alert('Product added successfully');
//           // this.product = { images: [] } as Product;
//           this.router.navigateByUrl('/products');
//         },
//         error: (err) => {
//           console.log(err);
//           alert('Error adding product');
//         }
//       });
//     }
//   }
// }



import { Component, inject, OnInit } from '@angular/core';
import { CategoriesS } from '../../../../services/category';
import { Observable } from 'rxjs';
import { Category } from '../../../../models/category';
import { AsyncPipe } from '@angular/common';
import { Product } from '../../../../models/product';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../services/product';
import { Router, ActivatedRoute } from '@angular/router'; 

@Component({
  selector: 'app-add-product',
  imports: [AsyncPipe, FormsModule],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css',
})
export class AddProduct implements OnInit { 
  private categoriesService = inject(CategoriesS);
  private productsService = inject(ProductService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute); 

  categories$: Observable<Category[]> = this.categoriesService.getAllCategories();

  product: Product = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    image: '',
    categoryId: ''
  };
  isEdit = false;

  ngOnInit(): void { 
    const id = this.activatedRoute.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.productsService.getProductById(id).subscribe({
        next: (data) => this.product = data,
        error: (err) => console.log(err)
      });
    }
  }

  submitProduct() {
    if (this.isEdit) {
      this.productsService.updateProduct(this.product).subscribe({
        next: () => {
          alert('Product updated successfully ✅');
          this.router.navigateByUrl('/products');
        },
        error: (err) => console.log(err)
      });
    } else {
      this.productsService.addNewProduct(this.product).subscribe({
        next: () => {
          alert('Product added successfully ✅');
          this.router.navigateByUrl('/products');
        },
        error: (err) => console.log(err)
      });
    }
  }
}