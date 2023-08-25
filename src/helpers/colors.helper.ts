import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class ColorsHelper {
  getCssVariableValue(variableName: string): string {
    const clearVar = variableName?.replace('var(', '')?.replace(')', '')?.trim()
    return getComputedStyle(document.documentElement).getPropertyValue(clearVar) || variableName
  }

  lightenDarkenColor(color: string, amount: number): string {
    color = color?.trim()
    let colorWithoutHash = color?.replace('var(', '')?.replace(')', '')?.replace('#', '')
    if (colorWithoutHash?.length === 3) {
      colorWithoutHash = colorWithoutHash
        .split('')
        .map((c) => `${c}${c}`)
        .join('')
    }

    const getColorChannel = (substring: string) => {
      let colorChannel = Math.max(Math.min(255, parseInt(substring, 16) + amount), 0).toString(16)
      if (colorChannel?.length < 2) {
        colorChannel = `0${colorChannel}`
      }
      return colorChannel
    }

    const colorChannelRed = getColorChannel(colorWithoutHash?.substring(0, 2))
    const colorChannelGreen = getColorChannel(colorWithoutHash?.substring(2, 4))
    const colorChannelBlue = getColorChannel(colorWithoutHash?.substring(4, 6))

    return `#${colorChannelRed}${colorChannelGreen}${colorChannelBlue}`
  }
}
