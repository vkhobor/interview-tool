export interface Repository {
  id: string;
  owner: string;
  name: string;
  description: string;
  questionCount: number;
  lastUpdated: string;
}

export interface Question {
  id: string;
  isStarred: boolean;
  title: string;
  body: string;
  tags: string[];
  repositoryId: string;
}

export interface QuestionWithState extends Question {
  isAsked: boolean;
  isHidden: boolean;
  isExpanded: boolean;
  notes: string;
}

export interface User {
  token: string;
}
