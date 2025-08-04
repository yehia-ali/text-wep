export interface VoteSent {
  id: number,
  title: string,
  priority: number
  hasStarted: boolean,
  hasEnded: boolean,
  startDate: string,
  endDate: string,
  voteFormResult: {
    total: number,
    voters: number
    percentage: number
  },
  assigneeImageUrls: [string],
  isReportPublic: boolean,
  voteFormStateId: number,
  timeLeft: number,
  timeLeftLabel: string,
  bullet: string,
}
