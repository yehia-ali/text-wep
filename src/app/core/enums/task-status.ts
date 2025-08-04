export enum TaskStatus {
  "new" = 1,
  "completed",
  "in_progress",
  // "pending" old but actual status From Back end = overdue but not return data,
  // "draft" = 5 not return data,
  "canceled" = 6,
  "pending", // waiting for approval
  "rejected",
  // "notified"
}
