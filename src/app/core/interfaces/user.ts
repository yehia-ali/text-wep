export interface User {
  "id": number;
  "spaceId": number;
  "departmentId": number;
  "countryId": number;
  "managerId": number;
  "memberCode": string;
  "departmentName": string;
  "name": string;
  "phoneNumber": string;
  "email": string;
  "imageUrl": string,
  "jobTitle": string;
  "jobDescription": string,
  "isActivated": boolean,
  "creationDate": string;
  "managerName": string,
  "country": {
    "enName": string;
    "arName": string;
    "countryCode": string;
    "countryCallingCode": string;
    "countryFlag": string;
  },
  "profileRoles": any,
  "profileCV": any,
  isSelected?: boolean,
  rate: number
}
