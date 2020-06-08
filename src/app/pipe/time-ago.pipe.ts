import { Pipe, PipeTransform } from '@angular/core';
import since from 'since-time-ago';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return since(value);
  }

}
