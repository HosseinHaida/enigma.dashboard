import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe implements PipeTransform {
  transform(array: any[], filterContent: string[], arrayItemKeys: string[]): any {
    if (!array) { return; }
    const resultArray = [];
    for (const item of array) {
      let i = 0;
      for (const key of arrayItemKeys) {
        let convertedProperty;
        if (typeof(item[key]) === 'object') {
          convertedProperty = item[key].length.toString();
        } else {
          convertedProperty = item[key].toString();
        }
        if (convertedProperty.includes(filterContent[i])) {
          i ++;
        }
      }
      if (i === filterContent.length) {
        resultArray.push(item);
      }
    }
    return resultArray;
  }
}
