import { Pipe, PipeTransform } from '@angular/core'

@Pipe({ name: 'thousandSuff' })
export class ThousandSuffixesPipe implements PipeTransform {
  transform(input: number, round?: string, toFixedArgs?: number): string {
    const suffixes = ['k', 'M', 'G', 'T', 'P', 'E']
    if (Number.isNaN(input) || input === null || (!input && input !== 0)) {
      return '∞'
    }

    if (input < 1000) {
      if (round) {
        return String(Math.round(input))
      }
      return String(input)
    }

    const exp = Math.floor(Math.log(input) / Math.log(1000))
    return (input / Math.pow(1000, exp)).toFixed(toFixedArgs) + suffixes[exp - 1]
  }
}
