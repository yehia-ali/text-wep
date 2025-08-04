export interface VoteReport {
  id: number,
  isAnonymous: boolean,
  isReportPublic: boolean,
  priority: number,
  title: string,
  voteFormCreatorId: number,
  voteFormQuestions: [Question]
}

export interface Question {
  id: number,
  title: string,
  type: number,
  voteFormQuestionChoices: [QuestionChoices]
}

export interface QuestionChoices {
  id: number,
  text: string,
  questionChoicesResult: {
    percentage: number,
    selectedCount: number,
    total: number,
  }
}
