import { ChangeDetectionStrategy, Component } from '@angular/core';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-sandbox-page',
  imports: [
    Button
  ],
  templateUrl: './sandbox-page.component.html',
  styleUrl: './sandbox-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SandboxPageComponent {

}
