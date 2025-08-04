import {inject} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";

export function enumToArray(enumObj: any): any {
  let translate = inject(TranslateService)
  return Object.entries(enumObj)
    .filter((item) => typeof item[1] == 'string')
    .map((key) => ({
      name: translate.instant(`${key[1]}`),
      value: key[0],
    }))
}
