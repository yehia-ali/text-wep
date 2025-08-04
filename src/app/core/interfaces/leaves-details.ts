export interface LeavesDetails {
  id: number,
  leave_days: number,
  leaves_type: string,
  employee_id: number,
  employee_name: string,
  employee_job_title: string,
  employee_image_url: string,
  manager_id: number,
  manager_name: string,
  manager_job_title: string,
  manager_image_url: string,
  reason: string,
  stateReason: string,
  start_date: string,
  end_date: string,
  leaveStatus: number,
  leaveAttachments:
    {
      fileName: string,
      fileType: number,
      contentType: string,
      filePath: string,
      fileSize: number
    }[],
  isEmployee: boolean,
  isManager: boolean,
  histories: any
}
