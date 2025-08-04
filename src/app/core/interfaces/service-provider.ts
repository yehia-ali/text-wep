export interface ServiceProvider {
  id: number;
  imageUrl: string;
  name: string;
  jobTitle: string;
  yearsEx: number;
  rate: number;
  sessionFees: number;
  sessionDuration: number;
  isAvailable: boolean;
  isVerified: boolean;
  currency: Currency;
}

export interface Currency {
  countryId: number;
  currencyCode: string;
  id: number;
  name: string;
}
