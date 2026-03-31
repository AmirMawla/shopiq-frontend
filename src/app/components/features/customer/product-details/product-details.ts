import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../../../../models/product';
import { ProductService } from '../../../../services/product';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {
 private activatedRoute = inject(ActivatedRoute);
  private apiProductsSErvice = inject(ProductService)
  private cdr = inject(ChangeDetectorRef)

  product: Product | null = null;
  loading = true;
  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    this.apiProductsSErvice.getProductById(id).subscribe({
      next: (res) => {
        this.product = res.data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.product = null;
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
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