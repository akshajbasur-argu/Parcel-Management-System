import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadAppButtonComponent } from './download-app-button.component';

describe('DownloadAppButtonComponent', () => {
  let component: DownloadAppButtonComponent;
  let fixture: ComponentFixture<DownloadAppButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DownloadAppButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadAppButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
