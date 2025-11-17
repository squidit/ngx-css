import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SqButtonComponent } from '@squidit/ngx-css';

/**
 * Exemplo de componente de conteúdo para Overlay
 */
@Component({
  selector: 'app-overlay-example-content',
  standalone: true,
  imports: [CommonModule, SqButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './overlay-example-content.component.html',
  styleUrls: ['./overlay-example-content.component.scss'],
})
export class OverlayExampleContentComponent {
  @Input() title = '📱 Overlay Exemplo';
  @Input() message = 'Este é um exemplo de overlay lateral!';

  counter = 0;

  increment() {
    this.counter++;
    console.log('Counter incrementado:', this.counter);
  }
}

