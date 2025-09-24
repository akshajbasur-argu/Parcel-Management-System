import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionistLayoutComponent } from './receptionist-layout.component';

describe('ReceptionistLayoutComponent', () => {
  let component: ReceptionistLayoutComponent;
  let fixture: ComponentFixture<ReceptionistLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReceptionistLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceptionistLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
