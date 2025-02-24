export interface Question {
  id: string;
  title: string;
  link: string;
}

export interface Sheet {
  _id: string;
  author: string;
  link: string | null;
  session: string;
  name: string;
  description: string;
  visibility: string;
  followers: number;
  tag: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  banner: string;
  slug: string;
  isFollowing: boolean;
}

export interface Topic {
  id?: string;
  title: string;
  questions: Question[];
  totalQuestions: number;
  completedQuestions: number;
}

export interface Data {
  data: {
    sheet: Sheet;
    questions: Question[];
  };
}
