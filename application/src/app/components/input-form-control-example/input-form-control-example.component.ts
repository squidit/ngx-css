import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SqInputFormControlComponent } from '@squidit/ngx-css';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-form-control-example',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SqInputFormControlComponent],
  templateUrl: './input-form-control-example.component.html',
  styleUrls: ['./input-form-control-example.component.scss'],
})
export class InputFormControlExampleComponent {
  // Reactive Form com validações
  userForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required]),
    url: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    bio: new FormControl(''),
  });

  // FormControl individual para demonstração
  searchControl = new FormControl('');

  // FormControl desabilitado para demonstração
  disabledControl = new FormControl({ value: 'Campo desabilitado', disabled: true });

  // Variáveis para demonstração de eventos
  lastKeyPressed = '';
  isFocused = false;
  isValid = false;
  lastValue = '';

  constructor() {
    // Observa mudanças no campo de busca
    this.searchControl.valueChanges.subscribe(value => {
      console.log('Search value changed:', value);
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      console.log('Form submitted:', this.userForm.value);
      alert('Formulário enviado com sucesso! Veja o console para os valores.');
    } else {
      console.log('Form is invalid');
      alert('Por favor, preencha todos os campos corretamente.');
      this.markFormGroupTouched(this.userForm);
    }
  }

  onReset() {
    this.userForm.reset();
    this.searchControl.reset();
  }

  onKeyDown(event: KeyboardEvent) {
    this.lastKeyPressed = `KeyDown: ${event.key}`;
  }

  onKeyUp(event: KeyboardEvent) {
    this.lastKeyPressed = `KeyUp: ${event.key}`;
  }

  onFocusChange(focused: boolean) {
    this.isFocused = focused;
  }

  onValueChange(value: any) {
    this.lastValue = value;
  }

  // Helper para marcar todos os campos como touched
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Preenche o formulário com dados de exemplo
  fillWithExample() {
    this.userForm.patchValue({
      name: 'João Silva',
      email: 'joao.silva@exemplo.com',
      phone: '(11) 98765-4321',
      url: 'https://exemplo.com',
      password: 'senha123',
      bio: 'Desenvolvedor Angular com experiência em componentes standalone.',
    });
  }

  // Logs do estado do formulário
  logFormState() {
    console.log('Form Value:', this.userForm.value);
    console.log('Form Valid:', this.userForm.valid);
    console.log('Form Errors:', this.getFormErrors());
  }

  getFormErrors() {
    const errors: any = {};
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      if (control?.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }
}
