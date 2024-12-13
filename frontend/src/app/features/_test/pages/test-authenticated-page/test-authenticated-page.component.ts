import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-test-authenticated-page',
  imports: [],
  templateUrl: './test-authenticated-page.component.html',
  styleUrl: './test-authenticated-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TestAuthenticatedPageComponent {

}
