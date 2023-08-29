import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class ValidatorHelper {

  email(email: string): boolean {
    return /^[_\-a-z0-9]+(\.[-_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]+)$/i.test(email)
  }

  url(url: string): boolean {
    const pattern = new RegExp(
      '^(https?:\\/\\/)' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
      'i'
    ) // fragment locator
    return !!pattern.test(url)
  }

  date(date: string): boolean {
    return !!Date.parse(date)
  }

  cnpj(value = '') {
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
      sum += parseFloat(numbers.charAt(parseFloat(numbers) - i)) * pos--
      if (pos < 2) {
        pos = 9
      }
    }
    if (sum % 11 < 2 ? 0 : 11 - (sum % 11) !== parseInt(digits.charAt(1), 10)) {
      return false
    }
    return true
  }

  phone(phone = '') {
    const regex = /(\d{2})(\d{0,1})(\d{4})(\d{4})/
    return phone.match(regex) !== null
  }

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
