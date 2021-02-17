export class SaveSurvey {
  exchangeID: number = 0;
  questionGroupID: number = 0;
  description: string = '';
  surveyAnswer: SurveyAnswer[] = [];
}

export class SurveyAnswer {
  questionID: number = 0;
  optionID?: number = 0;
  descriptiveAnswer?: string = '';
  barom?: number | null = null;
}
