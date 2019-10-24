import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noTags'
  // pure: false
})
export class NoTagsPipe implements PipeTransform {
  transform(string: string): string {
    string = string.replace(/(<([^>]+)>)/gi, '');
    string = string.replace(/&nbsp;/gi, ' ');
    return string;
  }
}
