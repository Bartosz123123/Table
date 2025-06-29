import { Component } from '@angular/core';

import { TabComponent } from './tab/tab.component';

@Component({
  selector: 'app-root',
  imports: [TabComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
