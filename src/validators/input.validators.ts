import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ValidatorHelper } from '../helpers/validator.helper';

/**
 * Custom validators for input components.
 * These validators wrap the existing ValidatorHelper methods to provide
 * Angular ValidatorFn compatible functions.
 *
 * All validation logic is reused from ValidatorHelper for consistency.
 */

// Create a singleton instance of ValidatorHelper
const validatorHelper = new ValidatorHelper();

/**
 * Input validators that wrap ValidatorHelper methods.
 * These provide Angular-compatible validators while reusing existing validation logic.
 */
export class InputValidators {
  /**
   * Validator for phone numbers.
   * Uses ValidatorHelper.phone() for validation.
   * Validates Brazilian phone formats: (XX) XXXXX-XXXX or (XX) XXXX-XXXX
   *
   * @returns A validator function that returns an error object if validation fails.
   *
   * @example
   * control = new FormControl('', [InputValidators.phone()]);
   */
  static phone(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate empty values (use Validators.required for that)
      }

      const value = String(control.value);
      const numbersOnly = value.replace(/\D/g, '');

      const isValid = validatorHelper.phone(numbersOnly);

      return isValid ? null : { phone: { value: control.value } };
    };
  }

  /**
   * Validator for URLs.
   * Uses ValidatorHelper.url() for validation.
   * Validates common URL formats (http, https, etc.)
   *
   * @returns A validator function that returns an error object if validation fails.
   *
   * @example
   * control = new FormControl('', [InputValidators.url()]);
   */
  static url(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate empty values
      }

      const value = String(control.value);
      const isValid = validatorHelper.url(value);

      return isValid ? null : { url: { value: control.value } };
    };
  }

  /**
   * Validator for email addresses.
   * Uses ValidatorHelper.email() for validation.
   *
   * @returns A validator function that returns an error object if validation fails.
   *
   * @example
   * control = new FormControl('', [InputValidators.email()]);
   */
  static email(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate empty values
      }

      const value = String(control.value);
      const isValid = validatorHelper.email(value);

      return isValid ? null : { email: { value: control.value } };
    };
  }

  /**
   * Validator for multiple email addresses separated by comma.
   * Uses ValidatorHelper.email() for each email validation.
   *
   * @returns A validator function that returns an error object if validation fails.
   *
   * @example
   * control = new FormControl('', [InputValidators.emailMultiple()]);
   */
  static emailMultiple(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate empty values
      }

      const value = String(control.value);

      // Split by comma and trim each email
      const emails = value.split(',').map(email => email.trim());

      // Find invalid emails using ValidatorHelper
      const invalidEmails = emails.filter(email => {
        // Skip empty strings
        if (!email) return false;
        return !validatorHelper.email(email);
      });

      if (invalidEmails.length > 0) {
        return {
          emailMultiple: {
            value: control.value,
            invalidEmails: invalidEmails,
          },
        };
      }

      return null;
    };
  }

  /**
   * Validator for CPF (Cadastro de Pessoas Físicas).
   * Uses ValidatorHelper.cpf() for validation.
   *
   * @returns A validator function that returns an error object if validation fails.
   *
   * @example
   * control = new FormControl('', [InputValidators.cpf()]);
   */
  static cpf(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const value = String(control.value).replace(/\D/g, '');
      const isValid = validatorHelper.cpf(value);

      return isValid ? null : { cpf: { value: control.value } };
    };
  }

  /**
   * Validator for CNPJ (Cadastro Nacional da Pessoa Jurídica).
   * Uses ValidatorHelper.cnpj() for validation.
   *
   * @returns A validator function that returns an error object if validation fails.
   *
   * @example
   * control = new FormControl('', [InputValidators.cnpj()]);
   */
  static cnpj(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const value = String(control.value).replace(/\D/g, '');
      const isValid = validatorHelper.cnpj(value);

      return isValid ? null : { cnpj: { value: control.value } };
    };
  }

  /**
   * Validator for file input.
   * Validates file type and size.
   *
   * @param options - Configuration for file validation
   * @param options.maxSize - Maximum file size in bytes
   * @param options.allowedTypes - Array of allowed MIME types
   * @returns A validator function that returns an error object if validation fails.
   *
   * @example
   * control = new FormControl('', [
   *   InputValidators.file({ maxSize: 5000000, allowedTypes: ['image/jpeg', 'image/png'] })
   * ]);
   */
  static file(options?: { maxSize?: number; allowedTypes?: string[] }): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const file = control.value as File;

      if (!(file instanceof File)) {
        return { file: { message: 'Value is not a file' } };
      }

      const errors: any = {};

      // Check file size
      if (options?.maxSize && file.size > options.maxSize) {
        errors.maxSize = {
          actual: file.size,
          max: options.maxSize,
        };
      }

      // Check file type
      if (options?.allowedTypes && !options.allowedTypes.includes(file.type)) {
        errors.fileType = {
          actual: file.type,
          allowed: options.allowedTypes,
        };
      }

      return Object.keys(errors).length > 0 ? { file: errors } : null;
    };
  }

  /**
   * Validator for monetary values that must be greater than zero.
   * Useful for price fields where zero is not a valid value.
   *
   * @returns A validator function that returns an error object if value is 0 or less.
   *
   * @example
   * priceControl = new FormControl(0, [InputValidators.notZero()]);
   */
  static notZero(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === undefined || control.value === '') {
        return null; // Don't validate empty values (use Validators.required for that)
      }

      // Parse value - handle string with separators (e.g., "1.234,56" or "1,234.56")
      let numericValue: number;

      if (typeof control.value === 'number') {
        numericValue = control.value;
      } else {
        // Remove thousand separators and normalize decimal
        const normalized = String(control.value)
          .replace(/\./g, '') // Remove dots (thousand separator in BR)
          .replace(',', '.'); // Replace comma with dot for parsing

        numericValue = parseFloat(normalized);
      }

      if (isNaN(numericValue) || numericValue <= 0) {
        return { notZero: { value: control.value } };
      }

      return null;
    };
  }

  /**
   * Validator for monetary values that must be greater than a minimum value.
   * Similar to Validators.min but handles formatted strings.
   *
   * @param min - Minimum allowed value (exclusive if `exclusive` is true)
   * @param exclusive - If true, value must be greater than min; if false, greater than or equal
   * @returns A validator function that returns an error object if validation fails.
   *
   * @example
   * priceControl = new FormControl(0, [InputValidators.minValue(100)]); // >= 100
   * priceControl = new FormControl(0, [InputValidators.minValue(0, true)]); // > 0
   */
  static minValue(min: number, exclusive = false): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === null || control.value === undefined || control.value === '') {
        return null;
      }

      let numericValue: number;

      if (typeof control.value === 'number') {
        numericValue = control.value;
      } else {
        const normalized = String(control.value)
          .replace(/\./g, '')
          .replace(',', '.');

        numericValue = parseFloat(normalized);
      }

      if (isNaN(numericValue)) {
        return { minValue: { min, actual: control.value } };
      }

      const isValid = exclusive ? numericValue > min : numericValue >= min;

      if (!isValid) {
        return { minValue: { min, actual: numericValue, exclusive } };
      }

      return null;
    };
  }
}
