import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ValidatorHelper } from '../helpers/validator.helper';

/**
 * Singleton instance of ValidatorHelper for reusing validation methods
 */
const validatorHelper = new ValidatorHelper();

/**
 * Validators customizados para campos de data.
 * Reutiliza métodos do ValidatorHelper para consistência.
 */
export class DateValidators {
  /**
   * Validator para verificar se a data é válida
   */
  static date(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Não valida se vazio (use Validators.required separadamente)
      }

      const isValid = validatorHelper.date(control.value);
      return isValid ? null : { date: true };
    };
  }

  /**
   * Validator para verificar se a data é maior ou igual a uma data mínima
   * @param minDate Data mínima permitida (string no formato 'yyyy-mm-dd' ou Date)
   */
  static minDate(minDate: string | Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const controlDate = new Date(control.value);
      const min = new Date(minDate);

      // Compara apenas as datas (sem hora)
      controlDate.setHours(0, 0, 0, 0);
      min.setHours(0, 0, 0, 0);

      if (controlDate < min) {
        return {
          minDate: {
            minDate: typeof minDate === 'string' ? minDate : minDate.toISOString().split('T')[0],
            actualDate: control.value,
          },
        };
      }

      return null;
    };
  }

  /**
   * Validator para verificar se a data é menor ou igual a uma data máxima
   * @param maxDate Data máxima permitida (string no formato 'yyyy-mm-dd' ou Date)
   */
  static maxDate(maxDate: string | Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const controlDate = new Date(control.value);
      const max = new Date(maxDate);

      // Compara apenas as datas (sem hora)
      controlDate.setHours(0, 0, 0, 0);
      max.setHours(0, 0, 0, 0);

      if (controlDate > max) {
        return {
          maxDate: {
            maxDate: typeof maxDate === 'string' ? maxDate : maxDate.toISOString().split('T')[0],
            actualDate: control.value,
          },
        };
      }

      return null;
    };
  }

  /**
   * Validator para verificar se a data está dentro de um intervalo
   * @param minDate Data mínima permitida
   * @param maxDate Data máxima permitida
   */
  static dateRange(minDate: string | Date, maxDate: string | Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      // Usa os validators minDate e maxDate
      const minError = DateValidators.minDate(minDate)(control);
      if (minError) {
        return minError;
      }

      const maxError = DateValidators.maxDate(maxDate)(control);
      if (maxError) {
        return maxError;
      }

      return null;
    };
  }

  /**
   * Validator para verificar se a data é futura (maior que hoje)
   */
  static futureDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const controlDate = new Date(control.value);
      const today = new Date();

      controlDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      if (controlDate <= today) {
        return { futureDate: true };
      }

      return null;
    };
  }

  /**
   * Validator para verificar se a data é passada (menor que hoje)
   */
  static pastDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const controlDate = new Date(control.value);
      const today = new Date();

      controlDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      if (controlDate >= today) {
        return { pastDate: true };
      }

      return null;
    };
  }

  /**
   * Validator para verificar se é uma data de aniversário válida (idade mínima e máxima)
   * @param minAge Idade mínima permitida (padrão: 0)
   * @param maxAge Idade máxima permitida (padrão: 150)
   */
  static birthdate(minAge = 0, maxAge = 150): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const birthDate = new Date(control.value);
      const today = new Date();

      // Calcula a idade
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < minAge) {
        return {
          birthdate: {
            minAge,
            actualAge: age,
          },
        };
      }

      if (age > maxAge) {
        return {
          birthdate: {
            maxAge,
            actualAge: age,
          },
        };
      }

      // Não pode ser data futura
      if (birthDate > today) {
        return { birthdate: { futureDate: true } };
      }

      return null;
    };
  }
}
