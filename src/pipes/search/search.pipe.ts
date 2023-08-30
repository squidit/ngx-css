import { Pipe, PipeTransform } from '@angular/core'

@Pipe({ name: 'search' })
export class SearchPipe implements PipeTransform {
  transform(value: any, search: string): any {
    if (!search) {
      return value
    }
    if (!value) {
      return ''
    }
    const solution = value?.filter((v: any) => {
      if (!v) {
        return
      }
      return JSON.stringify(v).toLowerCase().indexOf(search.toLowerCase()) > -1
    })
    return solution
  }
}
