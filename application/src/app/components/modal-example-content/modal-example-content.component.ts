import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SqButtonComponent } from '@squidit/ngx-css';

/**
 * Exemplo de componente de conteúdo para Modal
 */
@Component({
  selector: 'app-modal-example-content',
  standalone: true,
  imports: [CommonModule, SqButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './modal-example-content.component.html',
  styleUrls: ['./modal-example-content.component.scss'],
})
export class ModalExampleContentComponent {
  @Input() title = '🎯 Modal Exemplo';
  @Input() message = 'Este é um exemplo de modal dinâmico!';

  counter = 0;

  increment() {
    this.counter++;
    console.log('Counter incrementado:', this.counter);
  }
}

