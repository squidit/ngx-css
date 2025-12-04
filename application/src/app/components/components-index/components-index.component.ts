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
      title: 'sq-input-mask-form-control',
      description: 'Componente de input com máscara baseado em Reactive Forms usando ngx-mask',
      icon: '⌨️',
      status: 'new',
      route: '/input-mask-form-control',
      features: [
        'Máscaras para telefone, CPF, CNPJ, CEP, etc',
        'Suporte a valores monetários',
        'Reactive Forms integrado',
        'Prefixos e sufixos customizáveis',
        'Separadores de milhares',
        'ChangeDetectionStrategy.OnPush',
      ],
    },
    {
      title: 'sq-input-money-form-control',
      description: 'Componente de input monetário baseado em Reactive Forms com prefixo automático de moeda',
      icon: '💰',
      status: 'new',
      route: '/input-money-form-control',
      features: [
        'Prefixo automático (BRL, USD, EUR, etc)',
        'Formato brasileiro/americano/europeu',
        'Reactive Forms integrado',
        'Validators.min/max suportados',
        'Input mode decimal (mobile-friendly)',
        'ChangeDetectionStrategy.OnPush',
      ],
    },
    {
      title: 'sq-input-number-form-control',
      description: 'Componente de input numérico baseado em Reactive Forms com separador de milhares',
      icon: '#️⃣',
      status: 'new',
      route: '/input-number-form-control',
      features: [
        'Números inteiros com separador de milhares',
        'Reactive Forms integrado',
        'Suporte a números negativos',
        'InputValidators.minValue/notZero',
        'Input mode numérico (mobile-friendly)',
        'ChangeDetectionStrategy.OnPush',
      ],
    },
    {
      title: 'sq-input-range-form-control',
      description: 'Componente de slider/range baseado em Reactive Forms para seleção de valores numéricos',
      icon: '🎚️',
      status: 'new',
      route: '/input-range-form-control',
      features: [
        'Slider nativo do HTML5',
        'Reactive Forms integrado',
        'Min/Max/Step configuráveis',
        'Cor customizável',
        'Valor flutuante opcional',
        'ChangeDetectionStrategy.OnPush',
      ],
    },
    {
      title: 'sq-input-file-form-control',
      description: 'Componente de upload de arquivo baseado em Reactive Forms com validações avançadas',
      icon: '📁',
      status: 'new',
      route: '/input-file-form-control',
      features: [
        'Upload único ou múltiplo',
        'Validação de tamanho de arquivo',
        'Filtro por tipo de arquivo',
        'Preview de arquivos selecionados',
        'Loading state integrado',
        'ChangeDetectionStrategy.OnPush',
      ],
    },
    {
      title: 'sq-select-form-control',
      description: 'Componente de select baseado em Reactive Forms com busca local/remota e infinity scroll',
      icon: '📋',
      status: 'new',
      route: '/select-form-control',
      features: [
        'Busca local (client-side)',
        'Busca remota (backend)',
        'Infinity scroll para listas grandes',
        'Templates customizados',
        'Grupos de opções',
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
    {
      title: 'sq-input-mask (Legacy)',
      description: 'Componente legado de input com máscara - use sq-input-mask-form-control em novos projetos',
      icon: '🔴',
      status: 'legacy',
      route: '/input-mask-form-control',
      features: ['Two-way binding', 'Máscaras básicas', 'Mantido para compatibilidade'],
    },
    {
      title: 'sq-input-money (Legacy)',
      description: 'Componente legado de input monetário - use sq-input-money-form-control em novos projetos',
      icon: '🔴',
      status: 'legacy',
      route: '/input-money-form-control',
      features: ['Two-way binding', 'Prefixo de moeda', 'Mantido para compatibilidade'],
    },
    {
      title: 'sq-input-number (Legacy)',
      description: 'Componente legado de input numérico - use sq-input-number-form-control em novos projetos',
      icon: '🔴',
      status: 'legacy',
      route: '/input-number-form-control',
      features: ['Two-way binding', 'Separador de milhares', 'Mantido para compatibilidade'],
    },
    {
      title: 'sq-input-range (Legacy)',
      description: 'Componente legado de slider - use sq-input-range-form-control em novos projetos',
      icon: '🔴',
      status: 'legacy',
      route: '/input-range-form-control',
      features: ['Two-way binding', 'Slider básico', 'Mantido para compatibilidade'],
    },
    {
      title: 'sq-input-file (Legacy)',
      description: 'Componente legado de upload - use sq-input-file-form-control em novos projetos',
      icon: '🔴',
      status: 'legacy',
      route: '/input-file-form-control',
      features: ['Two-way binding', 'Upload básico', 'Mantido para compatibilidade'],
    },
    {
      title: 'sq-select / sq-select-search (Legacy)',
      description: 'Componentes legados de select - use sq-select-form-control em novos projetos',
      icon: '🔴',
      status: 'legacy',
      route: '/select-form-control',
      features: ['Two-way binding', 'Select básico e com busca', 'Mantido para compatibilidade'],
    },
    {
      title: 'SqModalService',
      description: 'Serviço para abertura programática de modais e overlays com suporte a componentes dinâmicos',
      icon: '🪟',
      status: 'new',
      route: '/modal-service',
      features: [
        'Abertura programática via serviço',
        'Uso declarativo via template',
        'Injeção de componentes dinâmicos',
        'Templates customizados (header/body/footer)',
        'Modal e Overlay unificados',
        'afterClosed() com resultado tipado',
      ],
    },
    {
      title: 'sq-modal / sq-overlay (Legacy)',
      description: 'Componentes legados de modal - use SqModalService ou SqModalBaseComponent em novos projetos',
      icon: '🔴',
      status: 'legacy',
      route: '/modal-service',
      features: ['Uso via template', 'ng-template para conteúdo', 'Mantido para compatibilidade'],
    },
    {
      title: 'SqToastService',
      description: 'Serviço para exibir notificações toast com suporte completo a testes e Observable lifecycle',
      icon: '🔔',
      status: 'new',
      route: '/toast-service',
      features: [
        '100% Angular (sem window.Toast)',
        'Observable afterDismissed()',
        'Data-test attributes',
        'Mockável em testes',
        'Ações (Desfazer)',
        'Pause on hover',
      ],
    },
    {
      title: 'ToastHelper (Legacy)',
      description: 'Helper legado de toast - use SqToastService em novos projetos',
      icon: '🔴',
      status: 'legacy',
      route: '/toast-service',
      features: ['Depende de window.Toast', 'Não testável', 'Mantido para compatibilidade'],
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
