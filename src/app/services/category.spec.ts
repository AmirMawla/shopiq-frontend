// import { TestBed } from '@angular/core/testing';

// import { CategoryService } from './category';

// describe('Category', () => {
//   let service: CategoryService;

//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//     service = TestBed.inject(CategoryService);
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });
// });

import { TestBed } from '@angular/core/testing';
import { CategoriesS } from './category';

describe('CategoryService', () => {
  let service: CategoriesS; 

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriesS); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});


