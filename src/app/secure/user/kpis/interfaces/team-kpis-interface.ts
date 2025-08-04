export interface UserKpiData {
  employeeId: number;
  employeeName: string;
  employeeImage: string | null;
  employeeJobTitle: string | null;
  kpisCount: number;
  totalAchive: number; 
  isSelected?: boolean; 
  isExpand?: boolean;
  employeeKpiLists: EmployeeKpi[];
}

export interface EmployeeKpi {
  kpiId: number;
  kpiName: string;
  kpiCategoryName: string;
  startDate: string;
  endDate: string;
  evaluationFrequency: number;
  raterId: number;
  raterName: string;
  raterImage: string;
  raterJobTitle: string;
  weight: number;
  target: number;
  value: number;
  achieved: number;
  actual_on_target: number;
  actual_on_Weight: number;
  isSelected: boolean;
}