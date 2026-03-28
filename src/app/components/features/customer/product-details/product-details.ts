import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
// import { StaticProducts } from '../../services/static-products';
// import { IProduct } from '../../models/iproduct';
import { Observable } from 'rxjs';
// import { ProductsApi } from '../../services/products-api';
import { AsyncPipe, JsonPipe } from '@angular/common';
import{Product} from '../../../../models/product';
import { Category } from '../../../../models/category';
import { ProductService } from '../../../../services/product';
import { CategoriesS} from '../../../../services/category';

@Component({
  selector: 'app-product-details',
  imports: [RouterLink, AsyncPipe, JsonPipe],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
 private activatedRoute = inject(ActivatedRoute);
  private apiProductsSErvice = inject(ProductService)
  private cdr = inject(ChangeDetectorRef)

  product$!: Observable<Product>
  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    this.product$ = this.apiProductsSErvice.getProductById(id)

  }
}


// import { Component, inject, OnInit } from '@angular/core';
// import { ActivatedRoute, RouterLink } from '@angular/router';
// import { Observable } from 'rxjs';
// import { AsyncPipe, JsonPipe } from '@angular/common';
// import { Product } from '../../../../models/product';
// import { ProductService } from '../../../../services/product';

// @Component({
//   selector: 'app-product-details',
//   imports: [RouterLink, AsyncPipe, JsonPipe],
//   templateUrl: './product-details.html',
//   styleUrl: './product-details.css',
// })
// export class ProductDetails implements OnInit {
//   private route = inject(ActivatedRoute);
//   private apiProductsService = inject(ProductService);

//   product$!: Observable<Product>;

//   ngOnInit(): void {
//     const id = this.route.snapshot.paramMap.get('id');
//     console.log(id);
//     this.product$ = this.apiProductsService.getProductById(id!);
//   }
// }