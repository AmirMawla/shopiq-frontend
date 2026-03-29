import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';
import{Product} from '../../../../models/product';
import { Category } from '../../../../models/category';
import { ProductService } from '../../../../services/product';
import { CategoriesS} from '../../../../services/category';
import { Router } from '@angular/router';
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
  private router = inject(Router);

  product$!: Observable<Product>
  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    this.product$ = this.apiProductsSErvice.getProductById(id)

  }
  goBack() {
    this.router.navigate(['/customer/products']);
  }
}
