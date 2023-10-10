import { Injectable } from '@angular/core'

/**
 * A utility service for performing various types of validation tasks, such as email, URL, date,
 * CNPJ, phone number, CPF, and record employment number validation.
 *
 * @example
 * // Import and inject the ValidatorHelper service in a component or service.
 * import { Component } from '@angular/core';
 * import { ValidatorHelper } from './validator-helper.service';
 *
 * @Component({
 *   selector: 'app-root',
 *   template: '<button (click)="validateEmail()">Validate Email</button>',
 * })
 * export class AppComponent {
 *   constructor(private validatorHelper: ValidatorHelper) {}
 *
 *   validateEmail() {
 *     const isValid = this.validatorHelper.email('example@email.com');
 *     if (isValid) {
 *       console.log('Email is valid.');
 *     } else {
 *       console.log('Email is not valid.');
 *     }
 *   }
 * }
 */
@Injectable({
  providedIn: 'root',
})
export class ValidatorHelper {
  /**
   * Validates XOR Logic
   *
   * @param {any} x - any value to validate.
   * @param {any} y - any value to validate.
   * @returns {boolean} - `true` if the is an xor logic, otherwise `false`.
   */
  XOR(x: any, y: any): boolean {
    return (x || y) && !(x && y)
  }

  /**
   * Validates an email address.
   *
   * @param {string} email - The email address to validate.
   * @returns {boolean} - `true` if the email is valid, otherwise `false`.
   */
  email(email: string): boolean {
    return /^[_\-a-z0-9]+(\.[-_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]+)$/i.test(email)
  }

  /**
   * Validates a URL.
   *
   * @param {string} url - The URL to validate.
   * @returns {boolean} - `true` if the URL is valid, otherwise `false`.
   */
  url(url: string): boolean {
    const pattern = new RegExp(
      // '^(https:\/\/)(((([0-9]{1,3}\.){3}[0-9]{1,3})|([a-zA-Z0-9.-]+\.[a-zA-Z]{2,}))(?::[0-9]+)?(\/[^\s?#]*)?(\?[^?\s#]+)?(#\S*)?)$'
      '^(https?:\\/\\/)' + // matches the literal string https://
      '(((([0-9]{1,3}\\.){3}[0-9]{1,3})|' + // matches an IPv4 address (e.g., 192.168.0.1)
      '([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}))' + // matches a domain name (e.g., example.com).
      '(?::[0-9]+)' + // matches an optional colon : followed by one or more digits (port number)
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // matches an optional forward slash / followed by any number of non-whitespace characters, excluding ? and # (the path)
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // matches an optional question mark ? followed by one or more characters that are not ?, whitespace, or # (the query parameters).
      '(\\#[-a-z\\d_]*)?$', // matches an optional hash # followed by zero or more non-whitespace characters (the fragment identifier).
      'i'
    ) // fragment locator
    return !!pattern.test(url)
  }

  /**
   * Validates a date string.
   *
   * @param {string} date - The date string to validate.
   * @returns {boolean} - `true` if the date is valid, otherwise `false`.
   */
  date(date: string): boolean {
    return !!Date.parse(date)
  }

  /**
   * Validates a CNPJ (Cadastro Nacional da Pessoa Jurídica) number.
   *
   * @returns {boolean} - `true` if the CNPJ is valid, otherwise `false`.
   */
  cnpj(value = ''): boolean {
    if (value.length !== 14) {
      return false
    }
    for (const digit of Array.from(Array(10).keys())) {
      if (Array(14).fill(digit).join('') === value) {
        return false
      }
    }

    let size = value.length - 2
    let numbers = value.substring(0, size)
    const digits = value.substring(size)
    let sum = 0
    let pos = size - 7
    for (let i = size; i >= 1; i--) {
      sum += parseFloat(numbers.charAt(size - i)) * pos--
      if (pos < 2) {
        pos = 9
      }
    }
    if (sum % 11 < 2 ? 0 : 11 - (sum % 11) !== parseInt(digits.charAt(0), 10)) {
      return false
    }

    size = size + 1
    numbers = value.substring(0, size)
    sum = 0
    pos = size - 7
    for (let i = size; i >= 1; i--) {
      sum += parseFloat(numbers.charAt(size - i)) * pos--
      if (pos < 2) {
        pos = 9
      }
    }
    if (sum % 11 < 2 ? 0 : 11 - (sum % 11) !== parseInt(digits.charAt(1), 10)) {
      return false
    }
    return true
  }

  /**
   * Validates a phone number.
   *
   * @param {string} phone - The phone number to validate.
   * @returns {boolean} - `true` if the phone number is valid, otherwise `false`.
   */
  phone(phone = ''): boolean {
    const regex = /(\d{2})(\d{0,1})(\d{4})(\d{4})/
    return phone.match(regex) !== null
  }

  /**
   * Validates a CPF (Cadastro de Pessoas Físicas) number.
   *
   * @param {string} value - The CPF number to validate.
   * @returns {boolean} - `true` if the CPF is valid, otherwise `false`.
   */
  cpf(value = '') {
    let sum = 0
    let rest
    if (/^(.)\1+$/.test(value)) {
      return false
    }

    for (let i = 1; i <= 9; i++) {
      sum = sum + parseInt(value.substring(i - 1, i), 10) * (11 - i)
    }
    rest = (sum * 10) % 11

    if (rest === 10 || rest === 11) {
      rest = 0
    }
    if (rest !== parseInt(value.substring(9, 10), 10)) {
      return false
    }

    sum = 0
    for (let i = 1; i <= 10; i++) {
      sum = sum + parseInt(value.substring(i - 1, i), 10) * (12 - i)
    }
    rest = (sum * 10) % 11

    if (rest === 10 || rest === 11) {
      rest = 0
    }
    if (rest !== parseInt(value.substring(10, 11), 10)) {
      return false
    }
    return true
  }

  /**
   * Validates a record employment number.
   *
   * @param {string} recordEmployment - The record employment number to validate.
   * @returns {boolean} - `true` if the record employment number is valid, otherwise `false`.
   */
  recordEmployment(recordEmployment = '') {
    let total = 0
    let residual = 0
    let strResto = ''

    if (recordEmployment === '00000000000') {
      return false
    }

    for (let i = 0, ftap = '3298765432', resultado = 0; i <= 9; i++) {
      resultado = Number(recordEmployment.slice(i, i + 1)) * Number(ftap.slice(i, i + 1))
      total = total + resultado
    }

    residual = total % 11
    if (residual !== 0) {
      residual = 11 - residual
    }

    if (residual === 10 || residual === 11) {
      strResto = residual.toString()
      residual = Number(strResto.slice(1, 2))
    }

    if (residual !== Number(recordEmployment.slice(10, 11))) {
      return false
    }

    return true
  }
}
