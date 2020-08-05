import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Assessment';

  constructor(public router: Router) {}

  onClick(): void {
    console.log(this.router.url);
  }
}
