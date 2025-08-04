import {ServiceCategory} from "./service-category";

export interface ServiceSubCategory {
  "id": number,
  "serviceCategoryId": number,
  "isFavorite": boolean,
  "enName": string,
  "arName": string,
  "iconUrl": string,
  "serviceCategory": ServiceCategory
}
