import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ProductCardModel {
  id?: string;
  category?: string;
  name?: string;
  price?: number;
  oldPrice?: number;
  imageUrl?: string;
}

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCardComponent {
  @Input() product?: ProductCardModel;
}
