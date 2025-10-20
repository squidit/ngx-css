import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CodeExample {
  label: string;
  language: string;
  code: string;
}

@Component({
  selector: 'app-code-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './code-tabs.component.html',
  styleUrls: ['./code-tabs.component.scss'],
})
export class CodeTabsComponent {
  @Input() examples: CodeExample[] = [];
  @Input() title = '';

  activeTab = 0;

  selectTab(index: number): void {
    this.activeTab = index;
  }

  copyToClipboard(code: string): void {
    navigator.clipboard.writeText(code).then(() => {
      // Opcional: mostrar feedback de copiado
    });
  }
}

