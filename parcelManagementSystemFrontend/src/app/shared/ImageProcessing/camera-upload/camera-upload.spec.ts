import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraUpload } from './camera-upload';

describe('CameraUpload', () => {
  let component: CameraUpload;
  let fixture: ComponentFixture<CameraUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CameraUpload]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CameraUpload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
