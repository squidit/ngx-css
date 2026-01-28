import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SqInputFormControlComponent } from '@squidit/ngx-css';

@Component({
  selector: 'app-input-form-control-example',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SqInputFormControlComponent],
  templateUrl: './input-form-control-example.component.html',
  styleUrls: ['./input-form-control-example.component.scss'],
})
export class InputFormControlExampleComponent {
  // Exemplos serão adicionados aqui
}
