import { Pipe, PipeTransform } from '@angular/core';
import { Profit } from '../model/risk';

@Pipe({
  name: 'orderBy',
})
export class OrderByPipe implements PipeTransform {
  transform(profits: Profit[]): Profit[] {
    return profits.sort(
      (a, b) =>
        new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime()
    );
  }
}
