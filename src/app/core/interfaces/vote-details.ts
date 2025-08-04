export interface VoteDetails {
  assigneeId: number,
  assigneeImageUrl: string,
  assigneeName: string,
  creatorImageUrl: string,
  creatorName: string,
  hasStarted: boolean,
  hasEnded: boolean,
  description: string,
  endDate: string,
  id: number,
  isAnonymous: boolean,
  isAssignee: boolean,
  isCreator: boolean,
  isReportPublic: boolean,
  priority: number,
  startDate: string,
  title: string,
  voteFormCreatorId: number,
  voteFormQuestions: [
    {
      id: number,
      title: string,
      type: number,
      voteFormQuestionChoices: [
        {
          id: number,
          isSelected: boolean,
          text: string
        }
      ]
    }
  ],

  voteFormStateId: number
  voteStateId: number
}
