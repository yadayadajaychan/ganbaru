export interface ErrorResponse {
  error?: string;
}

export interface User {
  uid: number;
  name: string;
}

export interface Comment {
  answer_id: number;
  user: User;
  date: string;
  answer: string;
  score: number;
  vote: number;
}

export interface Post {
  post_id: number;
  user: User;
  title: string;
  full_text: string;
  date: string;
  last_activity: string;
  views: number;
  answers: number;
  instructor_answered: boolean;
  tags: string[];
  score: number;
  vote: number;

  preview?: boolean;
}

export interface Class {
  forum_id: number;
  owner: User;
  name: string;
  description: string;
  important: number;
  unread: number;
  unanswered: number;
}

export interface GetPostsResponse extends ErrorResponse {
  post_infos: Post[];
  next_page: number | undefined;
}

export interface GetCommentsResponse extends ErrorResponse {
  answers: Comment[];
  next_page: number | undefined;
}

export interface JoinClassResponse extends ErrorResponse {
  forum_id: string;
}

export interface GetJoinCodeResponse extends ErrorResponse {
  join_code: string;
}

export interface GetModJoinCodeResponse extends ErrorResponse {
  mod_join_code: string;
}

export interface GetIsModeratorResponse extends ErrorResponse {}

export interface GetClassesResponse extends ErrorResponse {
  forums: Class[];
}

export interface CreatePostResponse extends ErrorResponse {
  post_id: number;
}
