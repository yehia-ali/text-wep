export interface AggregateReport {
  departmentName: string,
  id: number,
  inboxTasks: {
    canceledTasks: {
      onTimeCount: number,
      onTimePercentage: number,
      overDueCount: number,
      overDuePercentage: number,
      percentage: number,
      totalCount: number,
    },
    completedTasks: {
      onTimeCount: number,
      onTimePercentage: number,
      overDueCount: number,
      overDuePercentage: number,
      percentage: number,
      totalCount: number,
    },
    inprogressTasks: {
      onTimeCount: number,
      onTimePercentage: number,
      overDueCount: number,
      overDuePercentage: number,
      percentage: number,
      totalCount: number,
    }
    newTasks: {
      onTimeCount: number,
      onTimePercentage: number,
      overDueCount: number,
      overDuePercentage: number,
      percentage: number,
      totalCount: number,
    }
    overDueTasks: {
      onTimeCount: number,
      onTimePercentage: number,
      overDueCount: number,
      overDuePercentage: number,
      percentage: number,
      totalCount: number,
    }
    pendingTasks: {
      onTimeCount: number,
      onTimePercentage: number,
      overDueCount: number,
      overDuePercentage: number,
      percentage: number,
      totalCount: number,
    }
    totalCount: number
  },
  sentTasks: {
    canceledTasks: {
      onTimeCount: number,
      onTimePercentage: number,
      overDueCount: number,
      overDuePercentage: number,
      percentage: number,
      totalCount: number,
    },
    completedTasks: {
      onTimeCount: number,
      onTimePercentage: number,
      overDueCount: number,
      overDuePercentage: number,
      percentage: number,
      totalCount: number,
    },
    inprogressTasks: {
      onTimeCount: number,
      onTimePercentage: number,
      overDueCount: number,
      overDuePercentage: number,
      percentage: number,
      totalCount: number,
    }
    newTasks: {
      onTimeCount: number,
      onTimePercentage: number,
      overDueCount: number,
      overDuePercentage: number,
      percentage: number,
      totalCount: number,
    }
    overDueTasks: {
      onTimeCount: number,
      onTimePercentage: number,
      overDueCount: number,
      overDuePercentage: number,
      percentage: number,
      totalCount: number,
    }
    pendingTasks: {
      onTimeCount: number,
      onTimePercentage: number,
      overDueCount: number,
      overDuePercentage: number,
      percentage: number,
      totalCount: number,
    }
    totalCount: number
  },
  name: string
}
