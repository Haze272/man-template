import { ChangeDetectionStrategy, Component } from '@angular/core';
import {Button} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {DatePicker} from 'primeng/datepicker';

@Component({
  selector: 'app-sandbox-page',
  imports: [
    Button,
    FormsModule,
    DatePicker
  ],
  templateUrl: './sandbox-page.component.html',
  styleUrl: './sandbox-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SandboxPageComponent {
  rangeDates: Date[] | undefined;
}
