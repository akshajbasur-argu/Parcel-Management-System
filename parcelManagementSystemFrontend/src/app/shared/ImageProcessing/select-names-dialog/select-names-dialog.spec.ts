import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectNamesDialog } from './select-names-dialog';

describe('SelectNamesDialog', () => {
  let component: SelectNamesDialog;
  let fixture: ComponentFixture<SelectNamesDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectNamesDialog]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SelectNamesDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
