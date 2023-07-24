import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryByCategoryComponent } from './gallery-by-category.component';

describe('GalleryByCategoryComponent', () => {
  let component: GalleryByCategoryComponent;
  let fixture: ComponentFixture<GalleryByCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GalleryByCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryByCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
