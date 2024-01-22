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
   * Milliseconds per second, equal to 1.000 ms
   */
  readonly MS_PER_SECOND = 1000

  /**
   * Milliseconds per minute, equal to 60.000 ms (60 seconds * 1000 milliseconds).
   */
  readonly MS_PER_MINUTE = 60 * this.MS_PER_SECOND

  /**
   * Milliseconds per hour, equal to 3.600.000 ms (60 minutes * 60 seconds * 1000 milliseconds).
   */
  readonly MS_PER_HOUR = 60 * this.MS_PER_MINUTE

  /** 
   * Milliseconds per day, equal to 86,400,000 ms (24 hours * 60 minutes * 60 seconds * 1000 milliseconds).
   */
  readonly MS_PER_DAY = 24 * this.MS_PER_HOUR

  /**
   * Milliseconds per week, equal to 604.800.000 ms (7 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds).
   */
  readonly MS_PER_WEEK = 7 * this.MS_PER_DAY

  /**
   * Formats the given date using Angular's formatDate function, allowing customization of the output format and timezone.
   * 
   * @param date - The Date object to be formatted.
   * @param format - (Optional) The format string for the output. Defaults to 'yyyy-MM-ddTHH:mm:ssZZZZZ'.
   * @param timezone - (Optional) The timezone to consider. If not provided, the local timezone is used.
   * @param locale - (Optional) A string representing the locale. Defaults to 'en-US'.
   * @see {@link https://angular.io/api/common/formatDate} - Angular formatDate documentation for additional format options.
   * @returns A string containing the formatted date.
   */
  format(date: Date, format = 'yyyy-MM-ddTHH:mm:ssZZZZZ', timezone?: string, locale = 'en-US'): string {
    return formatDate(date, format, locale, timezone)
  }

  /**
   * Returns the Date offset by the provided timezone.
   * 
   * @param date - The input Date object.
   * @param timezone - (Optional) The timezone to consider. If not provided, the local timezone is used.
   * @returns Date offset by the specified timezone.
   */
  timezoneDate(date: Date, timezone?: string): Date {
    return new Date(date.toLocaleString('en-US', { timeZone: timezone }))
  }

  /**
   * Calculates and returns the first moment of the day for a given date, considering the provided timezone.
   * 
   * @param date - The reference date for which to determine the start of the day.
   * @param timezone - (Optional) The timezone to consider. If not provided, the local timezone is used.
   * @returns A Date object representing the first moment of the day at 00:00:00.
   */
  startOfDay(date: Date, timezone?: string): Date {
    const tzDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toLocaleString('en-US', {timeZone: timezone})
    return new Date(tzDate)
  }

  /**
   * Calculates and returns the last moment of the day for a given date, considering the provided timezone.
   * 
   * @param date - The reference date for which to determine the end of the day.
   * @param timezone - (Optional) The timezone to consider. If not provided, the local timezone is used.
   * @returns A Date object representing the last moment of the day at 23:59:59.
   */
  endOfDay(date: Date, timezone?: string): Date {
    const startOfDay = this.startOfDay(date, timezone)
    return new Date(startOfDay.getTime() + (this.MS_PER_DAY - 1))
  }

  /**
   * Calculates and returns the first moment of the month for a given date, considering the provided timezone.
   * 
   * @param date - The reference date for which to determine the start of the month.
   * @param timezone - (Optional) The timezone to consider. If not provided, the local timezone is used.
   * @returns A Date object representing the first moment of the month at 00:00:00.
   */
  startOfMonth(date: Date, timezone?: string): Date {
    const localeDate = this.startOfDay(date, timezone)
    return new Date(localeDate.getFullYear(), localeDate.getMonth(), 1)
  }

  /**
   * Calculates and returns the last moment of the month for a given date, considering the provided timezone.
   * 
   * @param date - The reference date for which to determine the end of the month.
   * @param timezone - (Optional) The timezone to consider. If not provided, the local timezone is used.
   * @returns A Date object representing the last moment of the month at 23:59:59.
   */
  endOfMonth(date: Date, timezone?: string): Date {
    const localeDate = this.startOfDay(date, timezone)
    const nextMonth = new Date(localeDate.getFullYear(), localeDate.getMonth() + 1, 1)
    return new Date(nextMonth.getTime() - 1)
  }

  /**
   * Returns the difference between two dates in the specified unit.
   * 
   * @param unit - The unit of difference: 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks'.
   * @param firstDate - The first Date object.
   * @param secondDate - The second Date object.
   * @param timezone - (Optional) The timezone to consider. If not provided, the local timezone is used.
   * @returns The difference between the two dates in the specified unit.
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
   * Returns an array with the names of all days of the week, translated to the specified locale.
   * 
   * @param locale - A string representing the locale. Defaults to 'en-US'.
   * @returns An array containing the names of all days of the week.
   */
  weekdays = useMemo((locale = 'en-US'): Array<string> => {
    const currentDate = new Date()
    const daysOfWeek = []

    for (let i = 0; i < 7; i++) {
      const day = new Date(currentDate)
      day.setDate(currentDate.getDate() - currentDate.getDay() + i)
      daysOfWeek.push(day.toLocaleDateString(locale, { weekday: 'long' }))
    }
    return daysOfWeek
  })

  /**
    * Returns a Date with the specified day of the week.
    * 
    * @param day - From 0 to 6, where 0 is Sunday and 6 is Saturday. It can be positive for future weeks or negative for past weeks.
    * @param date - (Optional) The reference Date object. Defaults to the current date.
    * @param timezone - (Optional) The timezone to consider. If not provided, the local timezone is used.
    * @returns Date object representing the specified day of the week.
    */
  weekday(day: number, date = new Date(), timezone?: string): Date {
    date = this.timezoneDate(date, timezone)
    const currentDayOfWeek = date.getDay()
    const daysUntilTargetDay = (day - currentDayOfWeek)
    date.setDate(date.getDate() + daysUntilTargetDay)
    return date
  }

  /**
   * Returns the name of the day of the week for a given date, translated to the specified locale.
   * 
   * @param date - The input date for which to determine the day of the week.
   * @param timezone - (Optional) The timezone to consider. If not provided, the local timezone is used.
   * @param locale - (Optional) A string representing the locale. Defaults to 'en-US'.
   * @returns A string representing the full name of the day of the week.
   */
  dayOfTheWeek(date: Date, timezone?: string, locale = 'en-US'){
    const tzDate = this.timezoneDate(new Date(date), timezone)
    return tzDate.toLocaleDateString(locale, { weekday: 'long' })
  }

  /**
   * Adds the specified units to the date provided
   * 
   * @param value - The amount of units to add
   * @param unit - The unit to add, it can be 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months'
   * @param date - The date to add the units
   * @param timezone - The timezone to add the units
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
   * Checks if the provided date object is a valid date.
   * 
   * @param date - The date object to be checked for validity.
   * @returns `true` if the date is valid; `false` otherwise.
   */
  isDateValid(date: Date): boolean {
    return date instanceof Date && !isNaN(date.getTime())
  }

}