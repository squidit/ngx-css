import { formatDate } from '@angular/common'
import { Injectable } from '@angular/core'
import { useMemo } from './memo.helper'
/**
 * An utility service for working with dates in Angular applications.
 *
 * @example
 * // Inject the DateHelper service and use its methods:
 * constructor(private dateHelper: DateHelper) { }
 * 
 * // Or instance a new class
 * const dateHelper = new DateHelper()
 * 
 * // Format a date
 * const formattedDate = dateHelper.format(new Date())
 * 
 * // Get the date with the timezone
 * const timezoneDate = dateHelper.timezoneDate(new Date(), 'America/Sao_Paulo')
 *
 * // Get the start of the day
 * const startOfDay = dateHelper.startOfDay(new Date())
 * 
 * // Get the end of the day
 * const endOfDay = dateHelper.endOfDay(new Date())
 * 
 * // Get an array with all days of the week localized
 * const weekdays = dateHelper.weekdays('pt-BR')
 **/
@Injectable({
    providedIn: 'root',
})
export class DateHelper {

  /**
   * TODO: Daniel colocar a descrição da constante
   */
  readonly MS_PER_SECOND = 1000

  /**
   * TODO: Daniel colocar a descrição da constante
   */
  readonly MS_PER_MINUTE = 60 * this.MS_PER_SECOND

  /**
   * TODO: Daniel colocar a descrição da constante
   */
  readonly MS_PER_HOUR = 60 * this.MS_PER_MINUTE

  /**
   * TODO: Daniel colocar a descrição da constante
   */
  readonly MS_PER_DAY = 24 * this.MS_PER_HOUR

  /**
   * TODO: Daniel colocar a descrição da constante
   */
  readonly MS_PER_WEEK = 7 * this.MS_PER_DAY

  /**
   * Uses Angular's formatDate to format the date using the provided format and timezone
   * @param date
   * @param format Defaults to yyyy-MM-ddTHH:mm:ssZZZZZ
   * @param timezone Optional timezone
   * @see {@link https://angular.io/api/common/formatDate}
   * @returns String with the formatted date
   */
  format(date: Date, format = 'yyyy-MM-ddTHH:mm:ssZZZZZ', timezone?: string, locale = 'en-US'): string {
    return formatDate(date, format, locale, timezone)
  }

  /**
   * Returns the Date offset by timezone
   * @param date 
   * @param timezone 
   * @returns Date offset by timezone
   */
  timezoneDate(date: Date, timezone?: string): Date {
    return new Date(date.toLocaleString('en-US', { timeZone: timezone }))
  }

  /**
   * TODO: Daniel colocar a descrição da função
   * @param date 
   * @param timezone 
   * @returns TODO: Daniel colocar o retorno da função
   */
  startOfDay(date: Date, timezone?: string): Date {
    const tzDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toLocaleString('en-US', {timeZone: timezone})
    return new Date(tzDate)
  }

  /**
   * TODO: Daniel colocar a descrição da função
   * @param date 
   * @param timezone 
   * @returns TODO: Daniel colocar o retorno da função
   */
  endOfDay(date: Date, timezone?: string): Date {
    const startOfDay = this.startOfDay(date, timezone)
    return new Date(startOfDay.getTime() + (this.MS_PER_DAY - 1))
  }

  /**
   * TODO: Daniel colocar a descrição da função
   * @param date 
   * @param timezone 
   * @returns TODO: Daniel colocar o retorno da função
   */
  startOfMonth(date: Date, timezone?: string): Date {
    const localeDate = this.startOfDay(date, timezone)
    return new Date(localeDate.getFullYear(), localeDate.getMonth(), 1)
  }

  /**
   * TODO: Daniel colocar a descrição da função
   * @param date 
   * @param timezone 
   * @returns TODO: Daniel colocar o retorno da função
   */
  endOfMonth(date: Date, timezone?: string): Date {
    const localeDate = this.startOfDay(date, timezone)
    const nextMonth = new Date(localeDate.getFullYear(), localeDate.getMonth() + 1, 1)
    return new Date(nextMonth.getTime() - 1)
  }

  /**
    *  Returns the difference between two dates in the specified unit
    *  @param unit : 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks'
    *  @param firstDate: Date
    *  @param secondDate: Date
    *  @param timezone: string
    *  @returns number
  */
  diffDate(unit: 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks', firstDate: Date, secondDate: Date, timezone?: string): number {
    let unitTime: number
    switch(unit){
      case 'seconds':
        unitTime = this.MS_PER_SECOND
        break
      case 'minutes':
        unitTime = this.MS_PER_MINUTE
        break
      case 'hours':
        unitTime = this.MS_PER_HOUR
        break
      case 'days':
        unitTime = this.MS_PER_DAY
        break
      case 'weeks':
        unitTime = this.MS_PER_WEEK
        break
    }
  
    firstDate = this.timezoneDate(firstDate, timezone)
    secondDate = this.timezoneDate(secondDate, timezone)
    const difference = (firstDate.getTime() - secondDate.getTime()) / unitTime
    return Math.round(difference)
  }

  /**
    * Returns an array with all days of the week translated to the locale provided
    * 
    * @param locale: string - Locale
    * @returns string[]
   */
  weekdays = useMemo((locale = 'en-US'): Array<string> => {
    const date = new Date()
    const daysOfWeek = []

    for (let i = 0; i < 7; i++) {
      const day = new Date(date)
      day.setDate(date.getDate() - date.getDay() + i)
      daysOfWeek.push(day.toLocaleDateString(locale, { weekday: 'long' }))
    }
    return daysOfWeek
  })

  /**
   * Returns a date with the selected week day
   * @param day  From 0 to 6, where 0 is Sunday and 6 is Saturday. It can be positive for next weeks or negative for previous weeks
   * @param date 
   * @param timezone 
   * @returns Date with the day of the week
   */
  weekday(day: number, date = new Date(), timezone?: string): Date {
    date = this.timezoneDate(date, timezone)
    const currentDayOfWeek = date.getDay()
    const daysUntilTargetDay = (day - currentDayOfWeek)
    date.setDate(date.getDate() + daysUntilTargetDay)
    return date
  }

  /**
    * Returns a translated string with the date's day of the week.
    * 
    * @param date {Date}
    * @param timezone {String}
    * @param locale: string - Locale
    * @returns string[]
   */
  dayOfTheWeek(date: Date, timezone?: string, locale = 'en-US'){
    const tzDate = this.timezoneDate(new Date(date), timezone)
    return tzDate.toLocaleDateString(locale, { weekday: 'long' })
  }

  /**
   * Adds the specified units to the date provided
   * @param value The amount of units to add
   * @param unit The unit to add, it can be 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months'
   * @param date The date to add the units
   * @param timezone The timezone to add the units
   * @returns The new date with the units added
   */
  addDate(value: number, unit: 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months', date: Date, timezone?: string): Date {
    let unitTime: number
    switch(unit){
      case 'seconds':
        unitTime = this.MS_PER_SECOND
        break
      case 'minutes':
        unitTime = this.MS_PER_MINUTE
        break
      case 'hours':
        unitTime = this.MS_PER_HOUR
        break
      case 'days':
        unitTime = this.MS_PER_DAY
        break
      case 'weeks':
        unitTime = this.MS_PER_WEEK
        break
      case 'months':
        return new Date(date.setMonth(date.getMonth() + value))
        break
        default:
        throw new Error('Invalid unit')
    }

    const tzDate = this.timezoneDate(date, timezone)
    return new Date(tzDate.getTime() + (value * unitTime))
  }

  /**
   * Verifies if the date is valid
   * @param date 
   * @returns true if the date is valid, false otherwise
   */
  isDateValid(date: Date): boolean {
    return date instanceof Date && !isNaN(date.getTime())
  }

}