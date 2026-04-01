import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplySeller } from './apply-seller';

describe('ApplySeller', () => {
  let component: ApplySeller;
  let fixture: ComponentFixture<ApplySeller>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplySeller],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplySeller);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
