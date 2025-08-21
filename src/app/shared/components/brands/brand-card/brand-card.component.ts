import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ImgCtrlPipe } from "../../../pipes/img-ctrl.pipe";
import { ArrayToSingleImagePipe } from "../../../pipes/array-to-single-image.pipe";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-brand-card',
  templateUrl: './brand-card.component.html',
  styleUrl: './brand-card.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ImgCtrlPipe,
    ArrayToSingleImagePipe,
    NgOptimizedImage
  ],
})
export class BrandCardComponent {
  @Input() brand: any;

  protected readonly rawSrcset: string = '128w, 384w';

}
