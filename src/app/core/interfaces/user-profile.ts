import {ServiceSubCategory} from "./service-sub-category";

export interface UserProfile {
    "id": number,
    "countryId": number,
    "serviceSubCategoryId": number,
    "userId": string,
    "name": string,
    "phoneNumber": string,
    "email": string,
    "imageUrl": string,
    "jobTitle": string,
    "summary": string,
    "fireBaseToken": any,
    "isPublic": boolean,
    "sessionDuration": number,
    "bufferDuration": number,
    "sessionFees": number,
    "creationDate": string,
    currencyId: number,
    currency: Currency,
    "verified": boolean,
    "available": boolean,
    rate: number,
    "country": Country,
    "serviceSubCategory": ServiceSubCategory,
    "userSkills": [UserSkill],
    "userCertificates": [UserCertificate],
    "userWorkExperiences": [UserWorkExperience]
}

export interface Country {
    "id": number,
    "enName": string,
    "arName": string,
    "countryFlag": string,
}

export interface UserSkill {
    "id": number,
    "name": string,
}

export interface UserCertificate {
    "id": number,
    "name": string,
    "issueDate": string,
    "issueOrganizationName": string,
    "issueOrganizationImageUrl": string,
    "imageUrl": string,
}

export interface UserWorkExperience {
    "companyImageUrl": string;
    "companyName": string;
    "endDate": string;
    "id": number;
    "isPresent": boolean;
    "jobTitle": string;
    "startDate": string;
}

export interface Currency {
    countryId: number,
    currencyCode: string,
    id: number,
    name: string
}
