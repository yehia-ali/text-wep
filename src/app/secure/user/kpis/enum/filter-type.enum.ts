export enum FilterType {
  SEARCH = 'search',
  DEPARTMENT = 'department',
  CATEGORY = 'category',
  DATE = 'date',
}
export enum EvaluationFrequency {
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
  Quarterly = 'quarterly',
  Yearly = 'yearly'
}
export enum KpiType {
  TaskBased = 1,
  Increased = 2,
  Decreased = 3
}


export const kpiRepetitionOptions = [
  { label: 'no_repeat', value: 6 },
  // { label: 'daily', value: 1 },
  // { label: 'weekly', value: 2 },
  { label: 'monthly', value: 3 },
  // { label: 'quarterly', value: 4 },
  // { label: 'yearly', value: 5 }
];