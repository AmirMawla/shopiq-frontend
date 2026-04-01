import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserDetails } from './edit-user-details';

describe('EditUserDetails', () => {
  let component: EditUserDetails;
  let fixture: ComponentFixture<EditUserDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditUserDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(EditUserDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
