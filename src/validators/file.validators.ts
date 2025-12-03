import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validators customizados para campos de arquivo (file input).
 * Fornece validações reutilizáveis para upload de arquivos.
 */
export class FileValidators {
  /**
   * Validator para verificar o tamanho máximo de arquivo(s)
   * @param maxSize Tamanho máximo permitido em bytes
   * @returns ValidatorFn
   *
   * @example
   * ```typescript
   * fileControl = new FormControl(null, [
   *   FileValidators.maxFileSize(5 * 1024 * 1024) // 5MB
   * ]);
   * ```
   */
  static maxFileSize(maxSize: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const files = control.value;

      if (!files || (files instanceof FileList && files.length === 0)) {
        return null; // Não valida se vazio (use Validators.required separadamente)
      }

      // Converte FileList para array para facilitar validação
      const fileArray: File[] = Array.from(files);
      const oversizedFiles = fileArray.filter((file: File) => file.size > maxSize);

      if (oversizedFiles.length > 0) {
        return {
          maxSize: {
            maxSize,
            actualSize: oversizedFiles[0].size,
            message: `Arquivo(s) excede(m) o tamanho máximo de ${FileValidators.formatFileSize(maxSize)}`,
          },
        };
      }

      return null;
    };
  }

  /**
   * Validator para verificar tipos de arquivo permitidos
   * @param allowedTypes Array de extensões permitidas (ex: ['.pdf', '.jpg', '.png'])
   * @returns ValidatorFn
   *
   * @example
   * ```typescript
   * fileControl = new FormControl(null, [
   *   FileValidators.fileType(['.pdf', '.doc', '.docx'])
   * ]);
   * ```
   */
  static fileType(allowedTypes: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const files = control.value;

      if (!files || (files instanceof FileList && files.length === 0)) {
        return null;
      }

      const fileArray: File[] = Array.from(files);
      const invalidFiles = fileArray.filter((file: File) => {
        const fileName = file.name.toLowerCase();
        const hasValidExtension = allowedTypes.some((type) => fileName.endsWith(type.toLowerCase()));
        return !hasValidExtension;
      });

      if (invalidFiles.length > 0) {
        return {
          fileType: {
            allowedTypes,
            invalidFiles: invalidFiles.map((file: File) => file.name),
            message: `Tipo de arquivo não permitido. Permitidos: ${allowedTypes.join(', ')}`,
          },
        };
      }

      return null;
    };
  }

  /**
   * Validator para verificar número máximo de arquivos
   * @param maxFiles Número máximo de arquivos permitidos
   * @returns ValidatorFn
   *
   * @example
   * ```typescript
   * fileControl = new FormControl(null, [
   *   FileValidators.maxFiles(5)
   * ]);
   * ```
   */
  static maxFiles(maxFiles: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const files = control.value;

      if (!files || (files instanceof FileList && files.length === 0)) {
        return null;
      }

      const fileArray: File[] = Array.from(files);

      if (fileArray.length > maxFiles) {
        return {
          maxFiles: {
            maxFiles,
            actualFiles: fileArray.length,
            message: `Número máximo de arquivos excedido. Máximo: ${maxFiles}`,
          },
        };
      }

      return null;
    };
  }

  /**
   * Formata tamanho de arquivo em bytes para formato legível
   * @param bytes Tamanho em bytes
   * @returns String formatada (ex: "5 MB", "1.5 KB")
   */
  private static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}

