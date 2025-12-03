# Página de Comparação: sq-input vs sq-input-form-control

## 📋 Visão Geral

Esta página demonstra de forma completa e prática as diferenças, vantagens e casos de uso dos componentes **sq-input** (antigo) e **sq-input-form-control** (novo).

## 🎯 Objetivo

Fornecer exemplos práticos e comparativos que ajudem desenvolvedores a:
1. Entender as diferenças entre os dois componentes
2. Ver exemplos reais de uso
3. Decidir qual componente usar em cada situação
4. Aprender a migrar do componente antigo para o novo

## 📚 Seções da Página

### 1️⃣ Comparação Básica
- Input simples lado a lado
- Mostra a diferença de sintaxe
- Two-way binding vs FormControl

### 2️⃣ Validações Automáticas por Tipo
- **Email**: Validação de formato de email
- **Telefone**: Validação de telefone brasileiro
- **URL**: Validação de URLs
- **Email Múltiplo**: Validação de múltiplos emails separados por vírgula

**Destaque:** O novo componente aplica validators automaticamente baseado no `type`!

### 3️⃣ Validações Brasileiras (CPF e CNPJ)
- Demonstra validators de CPF e CNPJ
- Mostra que esses validators só estão disponíveis no novo componente
- Explica que são reutilizáveis (InputValidators.cpf(), InputValidators.cnpj())

### 4️⃣ Formulário Completo - Componente Antigo
- Formulário de contato completo
- Usando two-way binding
- Validações internas do componente

### 5️⃣ Formulário Completo - Componente Novo
- Formulário de contato com Reactive Forms
- Mostra estado do formulário (valid, touched, dirty)
- Validações com FormControl
- Exibição de erros customizada

### 6️⃣ Estados e Customizações
- Campo desabilitado
- Campo readonly
- Campo com limite de caracteres e contador

### 7️⃣ Debounce / timeToChange
- Demonstra uso de debounce para campos de busca
- Mostra resultados de busca simulados
- Útil para evitar chamadas excessivas à API

### 8️⃣ Validações Customizadas
- **Username**: Validação customizada (sem espaços, sem caracteres especiais)
- **Senha**: Validação de força da senha com indicador visual
- Mostra como criar validators personalizados

### 9️⃣ Resumo das Vantagens
- Comparação lado a lado das características
- Recomendação clara: usar o novo componente
- Lista de benefícios do novo componente

## 🚀 Como Usar

### Acessar a Página

1. Execute a aplicação:
```bash
npm start
```

2. Navegue para:
```
http://localhost:4200/input-comparison
```

### Integrar na Aplicação

Se a rota ainda não existe, adicione no arquivo de rotas:

```typescript
// app-routing.module.ts
import { InputComparisonExampleComponent } from './components/input-comparison-example/input-comparison-example.component';

const routes: Routes = [
  // ... outras rotas
  {
    path: 'input-comparison',
    component: InputComparisonExampleComponent
  }
];
```

## 💡 Exemplos de Código

### Formulário com Validações Automáticas

```typescript
// No componente
emailControl = new FormControl('', [Validators.required]);
phoneControl = new FormControl('', [Validators.required]);
```

```html
<!-- No template -->
<sq-input-form-control
  [formControl]="emailControl"
  [type]="'email'"  <!-- Validator aplicado automaticamente -->
  [label]="'Email'"
></sq-input-form-control>

@if (emailControl.touched && emailControl.errors?.['email']) {
  <small class="text-danger">Email inválido</small>
}
```

### Validação de CPF

```typescript
cpfControl = new FormControl('', [
  Validators.required,
  InputValidators.cpf()  // Reutiliza ValidatorHelper.cpf()
]);
```

```html
<sq-input-form-control
  [formControl]="cpfControl"
  [label]="'CPF'"
></sq-input-form-control>

@if (cpfControl.errors?.['cpf']) {
  <small class="text-danger">CPF inválido</small>
}
```

### Validador Customizado

```typescript
// Validador de força da senha
passwordStrengthValidator(control: FormControl): ValidationErrors | null {
  if (!control.value) return null;
  
  const value = control.value;
  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecialChar = /[!@#$%^&*()]/.test(value);
  
  const strength = (hasUpperCase ? 1 : 0) + 
                  (hasLowerCase ? 1 : 0) + 
                  (hasNumber ? 1 : 0) + 
                  (hasSpecialChar ? 1 : 0);
  
  if (strength < 3) {
    return { weakPassword: { strength } };
  }
  
  return null;
}

// Uso
passwordControl = new FormControl('', [
  Validators.required,
  Validators.minLength(8),
  this.passwordStrengthValidator
]);
```

## 🎨 Características Visuais

### Código de Cores

- **Verde**: Componente novo (sq-input-form-control)
- **Cinza**: Componente antigo (sq-input)
- **Azul**: Informações e dicas
- **Amarelo**: Avisos e notas importantes
- **Vermelho**: Erros de validação

### Badges

- `ANTIGO` (cinza): Componente sq-input
- `NOVO` (verde): Componente sq-input-form-control

### Cards

Cada seção está em um card com:
- Header colorido (gradiente roxo)
- Corpo com padding generoso
- Sombras suaves
- Animações de entrada

## 📊 Métricas e Comparação

| Característica | sq-input | sq-input-form-control |
|----------------|----------|----------------------|
| Binding | Two-way `[(value)]` | FormControl |
| Validações | Hardcoded | Validators reutilizáveis |
| Erro | Exibe automaticamente | Você controla |
| Extensibilidade | ❌ Limitada | ✅ Total |
| Reactive Forms | ⚠️ Limitado | ✅ Completo |
| Validators | Internos | Automáticos + Customizados |
| CPF/CNPJ | ❌ | ✅ |

## 🔧 Funcionalidades Interativas

### Botões de Ação

- **Enviar**: Submete o formulário e valida
- **Limpar**: Reseta todos os campos
- **Preencher Exemplo**: Preenche com dados de teste
- **Log Estado**: Exibe estado no console (formulário novo)

### Indicadores em Tempo Real

- **Valor atual**: Mostra o valor do campo
- **Estado do formulário**: Valid, Touched, Dirty
- **Força da senha**: Barra de progresso colorida
- **Resultados de busca**: Lista de resultados simulados

## 📱 Responsividade

A página é totalmente responsiva:
- **Desktop**: Layout de 2 colunas para comparação
- **Tablet**: Layout adaptado
- **Mobile**: Layout empilhado, uma coluna

## 🎓 Aprendizados

Esta página ensina:

1. **Validators reutilizáveis**: Como usar InputValidators em qualquer lugar
2. **Validações automáticas**: Como o type dispara validators
3. **Validators customizados**: Como criar suas próprias regras
4. **Reactive Forms**: Como usar FormControl e FormGroup
5. **Exibição de erros**: Como controlar quando e como mostrar erros
6. **Estado do formulário**: Como usar valid, touched, dirty
7. **Debounce**: Como implementar delay em inputs de busca

## 🚦 Recomendações

### Use sq-input-form-control quando:
- ✅ Iniciar novos projetos
- ✅ Precisar de Reactive Forms
- ✅ Quiser validações extensíveis
- ✅ Precisar de CPF/CNPJ
- ✅ Quiser controle total sobre erros

### Use sq-input quando:
- ⚠️ Manter código legado
- ⚠️ Two-way binding simples é suficiente
- ⚠️ Não precisa de validações complexas

## 🐛 Troubleshooting

### Componente não renderiza
- Verifique se os imports estão corretos
- Certifique-se que o componente é standalone

### Validações não funcionam
- Verifique se o FormControl tem os validators
- Veja se o campo foi tocado (touched)
- Use `markAsTouched()` se necessário

### Erros não aparecem
- Lembre-se: o novo componente NÃO exibe erros automaticamente
- Você deve adicionar a lógica no template

## 📝 TODOs

Possíveis melhorias futuras:

- [ ] Adicionar seção de Performance Comparison
- [ ] Incluir exemplos com validações assíncronas
- [ ] Demonstrar integração com API real
- [ ] Adicionar testes unitários dos exemplos
- [ ] Criar versão em dark mode
- [ ] Adicionar exemplos com máscaras de input

## 🤝 Contribuindo

Para adicionar novos exemplos:

1. Adicione a lógica no `.ts`
2. Adicione o template no `.html`
3. Atualize os estilos se necessário no `.scss`
4. Documente o exemplo neste README

## 📄 Arquivos

- `input-comparison-example.component.ts` - Lógica e controles
- `input-comparison-example.component.html` - Template
- `input-comparison-example.component.scss` - Estilos
- `README.md` - Esta documentação

---

**Versão:** 1.0.0  
**Data:** 17 de Outubro de 2025  
**Autor:** Equipe de Desenvolvimento


