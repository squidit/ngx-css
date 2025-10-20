import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface ComponentCard {
  title: string;
  description: string;
  icon: string;
  status: 'new' | 'stable' | 'legacy';
  route: string;
  features: string[];
}

@Component({
  selector: 'app-components-index',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './components-index.component.html',
  styleUrls: ['./components-index.component.scss'],
})
export class ComponentsIndexComponent {
  components: ComponentCard[] = [
    {
      title: 'sq-input-form-control',
      description: 'Componente moderno de input baseado em Reactive Forms com ControlValueAccessor',
      icon: '📝',
      status: 'new',
      route: '/input-comparison',
      features: [
        'Reactive Forms nativo',
        'Validators reutilizáveis',
        'Validações de CPF, CNPJ, Email, URL',
        'Suporte a debounce',
        'ChangeDetectionStrategy.OnPush',
        'Diretiva sqValidation integrada',
      ],
    },
    {
      title: 'sq-input-date-form-control',
      description: 'Componente de input de data com validações avançadas de período e idade',
      icon: '📅',
      status: 'new',
      route: '/date-comparison',
      features: [
        'Validação de range (minDate/maxDate)',
        'Validação de idade (birthdate)',
        'Data passada/futura',
        'Formato ISO 8601',
        'Reactive Forms integrado',
        'ChangeDetectionStrategy.OnPush',
      ],
    },
    {
      title: 'sq-selector-form-control',
      description: 'Componente de checkbox, radio e toggle baseado em Reactive Forms',
      icon: '✅',
      status: 'new',
      route: '/selector-comparison',
      features: [
        'Checkbox, Radio e Toggle',
        'Reactive Forms integrado',
        'Cores customizáveis',
        'Estado indeterminado',
        'Templates customizados',
        'ChangeDetectionStrategy.OnPush',
      ],
    },
    {
      title: 'sq-validation-message',
      description: 'Componente reutilizável para exibir mensagens de validação de formulários',
      icon: '⚠️',
      status: 'new',
      route: '/input-comparison',
      features: [
        'Suporte a i18n',
        'Mensagens customizáveis',
        'Animações suaves',
        'Ícone opcional',
        'Compatível com qualquer FormControl',
      ],
    },
    {
      title: 'sqValidation (Diretiva)',
      description: 'Diretiva que anexa automaticamente validações aos campos de formulário',
      icon: '🎯',
      status: 'new',
      route: '/input-comparison',
      features: [
        'Anexa sq-validation-message automaticamente',
        'Mensagens customizadas por erro',
        'Template customizado opcional',
        'Controle de exibição (touched/dirty/always)',
        'Reduz boilerplate em 70%',
      ],
    },
    {
      title: 'sq-input (Legacy)',
      description: 'Componente legado de input - use sq-input-form-control em novos projetos',
      icon: '🔴',
      status: 'legacy',
      route: '/input-comparison',
      features: ['Two-way binding', 'Validações internas', 'Mantido para compatibilidade'],
    },
    {
      title: 'sq-input-date (Legacy)',
      description: 'Componente legado de data - use sq-input-date-form-control em novos projetos',
      icon: '🔴',
      status: 'legacy',
      route: '/date-comparison',
      features: ['Two-way binding', 'minDate/maxDate básico', 'Mantido para compatibilidade'],
    },
    {
      title: 'sq-selector (Legacy)',
      description: 'Componente legado de seletor - use sq-selector-form-control em novos projetos',
      icon: '🔴',
      status: 'legacy',
      route: '/selector-comparison',
      features: ['Two-way binding', 'Checkbox/Radio/Toggle', 'Mantido para compatibilidade'],
    },
  ];

  getStatusClass(status: string): string {
    const statusMap: Record<string, string> = {
      new: 'badge-new',
      stable: 'badge-stable',
      legacy: 'badge-legacy',
    };
    return statusMap[status] || '';
  }

  getStatusLabel(status: string): string {
    const labelMap: Record<string, string> = {
      new: 'NOVO ✨',
      stable: 'ESTÁVEL',
      legacy: 'LEGADO',
    };
    return labelMap[status] || status;
  }
}
