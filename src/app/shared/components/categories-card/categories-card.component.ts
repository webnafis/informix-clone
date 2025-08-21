import { Component, Input } from '@angular/core';
import { Category } from '../../../interfaces/common/category.interface';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { ImgCtrlPipe } from '../../pipes/img-ctrl.pipe';
import { ArrayToSingleImagePipe } from '../../pipes/array-to-single-image.pipe';

@Component({
  selector: 'app-categories-card',
  standalone: true,
  imports: [
    RouterLink,
    NgOptimizedImage,
    ImgCtrlPipe,
    ArrayToSingleImagePipe
  ],
  templateUrl: './categories-card.component.html',
  styleUrl: './categories-card.component.scss'
})
export class CategoriesCardComponent {
  // Decorator
  @Input() category: Category = null;
  ngOnInit() {

  }

  protected readonly rawSrcset: string = '128w, 384w';
}
