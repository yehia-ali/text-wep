export interface VoteInbox {
  id: number,
  voteFormId: number,
  title: string,
  priority: number
  startDate: string,
  endDate: string,
  voteStateId: number
  isReportPublic: boolean,
  creatorId: number
  creatorName: string,
  creatorJob: string,
  creatorImageUrl: string,
  timeLeft: number,
  timeLeftLabel: string,
  bullet: string,
}
