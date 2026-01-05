import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SqInputFileComponent } from '../../../../../src/components/sq-input-file/sq-input-file.component';
import { SqInputFileFormControlComponent } from '../../../../../src/components/sq-input-file-form-control/sq-input-file-form-control.component';
import { SqValidationDirective } from '../../../../../src/directives/sq-validation.directive';
import { CodeTabsComponent, CodeExample } from '../code-tabs/code-tabs.component';
import { BreadcrumbComponent, BreadcrumbItem } from '../breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-input-file-form-control-example',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SqInputFileComponent,
    SqInputFileFormControlComponent,
    SqValidationDirective,
    CodeTabsComponent,
    BreadcrumbComponent,
  ],
  templateUrl: './input-file-form-control-example.component.html',
  styleUrls: ['./input-file-form-control-example.component.scss'],
})
export class InputFileFormControlExampleComponent {
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Início', route: '/components-index', icon: 'fas fa-home' },
    { label: 'Input File Form Control', icon: 'fas fa-file-upload' },
  ];

  // ========== Seção 1: Upload Simples ==========
  oldFileValue: any = null;
  newFileControl = new FormControl<FileList | null>(null);

  // ========== Seção 2: Upload com Validação Required ==========
  oldFileRequiredValue: any = null;
  newFileRequiredControl = new FormControl<FileList | null>(null, [Validators.required]);

  // ========== Seção 3: Upload com Limite de Tamanho (5MB) ==========
  oldFileSizeValue: any = null;
  newFileSizeControl = new FormControl<FileList | null>(null);
  maxFileSize = 5 * 1024 * 1024; // 5MB

  // ========== Seção 4: Upload de Imagens ==========
  oldImageValue: any = null;
  newImageControl = new FormControl<FileList | null>(null);
  imagePreviewUrl: string | null = null;

  // ========== Seção 5: Upload Múltiplo ==========
  oldMultipleValue: any = null;
  newMultipleControl = new FormControl<FileList | null>(null);

  // ========== Seção 6: Upload de Documentos (PDF/DOC) ==========
  oldDocumentValue: any = null;
  newDocumentControl = new FormControl<FileList | null>(null, [Validators.required]);

  // ========== Seção 7: Upload com Loading State ==========
  uploadControl = new FormControl<FileList | null>(null);
  isUploading = false;
  uploadProgress = 0;

  // ========== Seção 8: Formulário Completo de Perfil ==========
  profileForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    avatar: new FormControl<FileList | null>(null),
    resume: new FormControl<FileList | null>(null, [Validators.required]),
  });

  avatarPreview: string | null = null;

  // Code Examples
  simpleFileCode: CodeExample[] = [
    {
      label: 'Componente Antigo (sq-input-file)',
      language: 'html',
      code: `<!-- HTML -->
<sq-input-file
  [label]="'Upload de Arquivo'"
  [placeholder]="'Escolher arquivo'"
  [(value)]="oldFileValue"
  [name]="'file'"
></sq-input-file>`,
    },
    {
      label: 'TypeScript (Antigo)',
      language: 'typescript',
      code: `oldFileValue: any = null;`,
    },
    {
      label: 'Componente Novo (sq-input-file-form-control)',
      language: 'html',
      code: `<!-- HTML -->
<sq-input-file-form-control
  [label]="'Upload de Arquivo'"
  [placeholder]="'Escolher arquivo'"
  [formControl]="newFileControl"
></sq-input-file-form-control>`,
    },
    {
      label: 'TypeScript (Novo)',
      language: 'typescript',
      code: `newFileControl = new FormControl<FileList | null>(null);`,
    },
  ];

  requiredFileCode: CodeExample[] = [
    {
      label: 'Componente Antigo (sq-input-file)',
      language: 'html',
      code: `<!-- HTML -->
<sq-input-file
  [label]="'Upload de Arquivo *'"
  [placeholder]="'Escolher arquivo'"
  [(value)]="oldFileRequiredValue"
  [name]="'fileRequired'"
  [required]="true"
></sq-input-file>`,
    },
    {
      label: 'Componente Novo (sq-input-file-form-control)',
      language: 'html',
      code: `<!-- HTML -->
<sq-input-file-form-control
  [label]="'Upload de Arquivo *'"
  [placeholder]="'Escolher arquivo'"
  [formControl]="newFileRequiredControl"
></sq-input-file-form-control>

<sq-validation-message
  [control]="newFileRequiredControl"
  [fieldName]="'Arquivo'"
  [showWhenTouched]="true"
></sq-validation-message>`,
    },
    {
      label: 'TypeScript (Novo)',
      language: 'typescript',
      code: `newFileRequiredControl = new FormControl<FileList | null>(null, [
  Validators.required
]);`,
    },
  ];

  fileSizeCode: CodeExample[] = [
    {
      label: 'Componente Antigo (sq-input-file)',
      language: 'html',
      code: `<!-- HTML -->
<sq-input-file
  [label]="'Upload (Máx. 5MB)'"
  [placeholder]="'Escolher arquivo'"
  [(value)]="oldFileSizeValue"
  [name]="'fileSize'"
  [maxSize]="maxFileSize"
></sq-input-file>`,
    },
    {
      label: 'Componente Novo (sq-input-file-form-control)',
      language: 'html',
      code: `<!-- HTML -->
<sq-input-file-form-control
  [label]="'Upload (Máx. 5MB)'"
  [placeholder]="'Escolher arquivo'"
  [formControl]="newFileSizeControl"
  [maxSize]="maxFileSize"
></sq-input-file-form-control>`,
    },
    {
      label: 'TypeScript (Novo)',
      language: 'typescript',
      code: `newFileSizeControl = new FormControl<FileList | null>(null);
maxFileSize = 5 * 1024 * 1024; // 5MB

// A validação é automática e exibe o erro no próprio componente`,
    },
  ];

  imageUploadCode: CodeExample[] = [
    {
      label: 'Componente Antigo (sq-input-file)',
      language: 'html',
      code: `<!-- HTML -->
<sq-input-file
  [label]="'Upload de Imagem'"
  [placeholder]="'Escolher imagem'"
  [(value)]="oldImageValue"
  [name]="'image'"
  [fileType]="'image/*'"
></sq-input-file>`,
    },
    {
      label: 'Componente Novo (sq-input-file-form-control)',
      language: 'html',
      code: `<!-- HTML -->
<sq-input-file-form-control
  [label]="'Upload de Imagem'"
  [placeholder]="'Escolher imagem'"
  [formControl]="newImageControl"
  [fileType]="'image/*'"
  (filesSelected)="onImageSelected($event)"
></sq-input-file-form-control>

@if (imagePreviewUrl) {
  <img [src]="imagePreviewUrl" alt="Preview" 
       style="max-width: 200px; margin-top: 1rem;">
}`,
    },
    {
      label: 'TypeScript (Novo)',
      language: 'typescript',
      code: `newImageControl = new FormControl<FileList | null>(null);
imagePreviewUrl: string | null = null;

onImageSelected(files: FileList | File[]) {
  if (files && files.length > 0) {
    const file = files[0] as File;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreviewUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}`,
    },
  ];

  multipleFileCode: CodeExample[] = [
    {
      label: 'Componente Antigo (sq-input-file)',
      language: 'html',
      code: `<!-- HTML -->
<sq-input-file
  [label]="'Upload Múltiplo'"
  [placeholder]="'Escolher arquivos'"
  [(value)]="oldMultipleValue"
  [name]="'multiple'"
  [multiple]="true"
></sq-input-file>`,
    },
    {
      label: 'Componente Novo (sq-input-file-form-control)',
      language: 'html',
      code: `<!-- HTML -->
<sq-input-file-form-control
  [label]="'Upload Múltiplo'"
  [placeholder]="'Escolher arquivos'"
  [formControl]="newMultipleControl"
  [multiple]="true"
></sq-input-file-form-control>`,
    },
    {
      label: 'TypeScript (Novo)',
      language: 'typescript',
      code: `newMultipleControl = new FormControl<FileList | null>(null);`,
    },
  ];

  documentUploadCode: CodeExample[] = [
    {
      label: 'Componente Novo - Upload de Documentos',
      language: 'html',
      code: `<!-- HTML -->
<sq-input-file-form-control
  [label]="'Upload de Documento * (PDF/DOC/DOCX)'"
  [placeholder]="'Escolher documento'"
  [formControl]="newDocumentControl"
  [fileType]="'.pdf,.doc,.docx'"
  [maxSize]="maxFileSize"
  sqValidation
  [fieldName]="'Documento'"
></sq-input-file-form-control>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `newDocumentControl = new FormControl<FileList | null>(null, [
  Validators.required
]);
maxFileSize = 5 * 1024 * 1024; // 5MB`,
    },
  ];

  loadingStateCode: CodeExample[] = [
    {
      label: 'Template com Loading State',
      language: 'html',
      code: `<!-- HTML -->
<sq-input-file-form-control
  [label]="'Upload com Loading'"
  [placeholder]="'Escolher arquivo'"
  [formControl]="uploadControl"
  [loading]="isUploading"
  (filesSelected)="simulateUpload($event)"
></sq-input-file-form-control>

@if (isUploading) {
  <div class="progress mt-2">
    <div class="progress-bar" [style.width.%]="uploadProgress">
      {{ uploadProgress }}%
    </div>
  </div>
}`,
    },
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `uploadControl = new FormControl<FileList | null>(null);
isUploading = false;
uploadProgress = 0;

simulateUpload(files: FileList | File[]) {
  if (!files || files.length === 0) return;

  this.isUploading = true;
  this.uploadProgress = 0;

  // Simula um upload
  const interval = setInterval(() => {
    this.uploadProgress += 10;
    if (this.uploadProgress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        this.isUploading = false;
        this.uploadProgress = 0;
        alert('Upload concluído!');
      }, 500);
    }
  }, 300);
}`,
    },
  ];

  profileFormCode: CodeExample[] = [
    {
      label: 'Template do Formulário',
      language: 'html',
      code: `<!-- HTML -->
<form [formGroup]="profileForm" (ngSubmit)="onProfileSubmit()">
  <sq-input-file-form-control
    formControlName="avatar"
    [label]="'Foto de Perfil'"
    [placeholder]="'Escolher imagem'"
    [fileType]="'image/*'"
    [maxSize]="2097152"
    (filesSelected)="onAvatarSelected($event)"
  ></sq-input-file-form-control>

  <sq-input-file-form-control
    formControlName="resume"
    [label]="'Currículo * (PDF)'"
    [placeholder]="'Escolher arquivo'"
    [fileType]="'.pdf'"
    [maxSize]="maxFileSize"
    sqValidation
    [fieldName]="'Currículo'"
  ></sq-input-file-form-control>

  <button type="submit" [disabled]="!profileForm.valid">
    Enviar Perfil
  </button>
</form>`,
    },
    {
      label: 'TypeScript',
      language: 'typescript',
      code: `profileForm = new FormGroup({
  name: new FormControl('', [Validators.required, Validators.minLength(3)]),
  email: new FormControl('', [Validators.required, Validators.email]),
  avatar: new FormControl<FileList | null>(null),
  resume: new FormControl<FileList | null>(null, [Validators.required]),
});

onProfileSubmit() {
  if (this.profileForm.valid) {
    console.log('Perfil:', this.profileForm.value);
    alert('Perfil enviado com sucesso!');
  }
}`,
    },
  ];

  /**
   * Lida com seleção de imagem e cria preview
   */
  onImageSelected(files: FileList | File[]): void {
    if (files && files.length > 0) {
      const file = files[0] as File;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  /**
   * Lida com seleção de avatar no formulário de perfil
   */
  onAvatarSelected(files: FileList | File[]): void {
    if (files && files.length > 0) {
      const file = files[0] as File;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.avatarPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  /**
   * Simula um upload com progresso
   */
  simulateUpload(files: FileList | File[]): void {
    if (!files || files.length === 0) return;

    this.isUploading = true;
    this.uploadProgress = 0;

    // Simula um upload
    const interval = setInterval(() => {
      this.uploadProgress += 10;
      if (this.uploadProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          this.isUploading = false;
          this.uploadProgress = 0;
          alert('Upload concluído com sucesso!');
        }, 500);
      }
    }, 300);
  }

  /**
   * Submete o formulário de perfil
   */
  onProfileSubmit(): void {
    if (this.profileForm.valid) {
      console.log('Perfil:', this.profileForm.value);
      alert('Perfil enviado com sucesso!');
      // Não limpa o formulário para manter os arquivos selecionados visíveis
    }
  }

  /**
   * Preenche o formulário de perfil com dados de exemplo
   */
  fillProfileExample(): void {
    this.profileForm.patchValue({
      name: 'João da Silva',
      email: 'joao.silva@email.com',
    });
    alert('Preencha os campos de arquivo manualmente selecionando arquivos.');
  }

  /**
   * Limpa o preview de imagem
   */
  clearImagePreview(): void {
    this.imagePreviewUrl = null;
    this.newImageControl.reset();
  }

  /**
   * Limpa o preview do avatar
   */
  clearAvatarPreview(): void {
    this.avatarPreview = null;
    this.profileForm.get('avatar')?.reset();
  }

  /**
   * Loga o estado do FormControl no console
   */
  logControlState(controlName: string, control: FormControl): void {
    console.log(`=== Estado do Control: ${controlName} ===`);
    console.log('Válido:', control.valid);
    console.log('Tocado:', control.touched);
    console.log('Sujo:', control.dirty);
    console.log('Valor:', control.value);
    console.log('Erros:', control.errors);
  }

  /**
   * Loga o estado do formulário no console
   */
  logFormState(formName: string, form: FormGroup): void {
    console.log(`=== Estado do Formulário: ${formName} ===`);
    console.log('Válido:', form.valid);
    console.log('Tocado:', form.touched);
    console.log('Sujo:', form.dirty);
    console.log('Valores:', form.value);
    console.log('Erros:', form.errors);
  }
}

