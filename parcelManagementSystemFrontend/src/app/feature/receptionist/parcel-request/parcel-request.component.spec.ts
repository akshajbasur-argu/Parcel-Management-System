import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelRequestComponent } from './parcel-request.component';

describe('ParcelRequestComponent', () => {
  let component: ParcelRequestComponent;
  let fixture: ComponentFixture<ParcelRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParcelRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParcelRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
