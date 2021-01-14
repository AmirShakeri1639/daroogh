export interface GetQuestionGroupOfExchangeInterface {
  id: number;
  isSystem: boolean;
  active: boolean;
  question: Question[];
}

export interface Question {
  id: number;
  title: string;
  questionGroupID: number;
  sort: number;
  type: number;
  typeString: string;
  questionOptions: QuestionOptions[];
}

export interface QuestionOptions {
  id: number;
  title: string;
  barom: number;
  sort: number;
  questionID: number;
}
