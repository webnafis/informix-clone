import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  // Theme Settings
  headerViews: string = 'Header 2';
  currentUrl: string = '/';

}
