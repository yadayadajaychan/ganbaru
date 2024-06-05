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

  // user related
  // isLiked?: boolean;
  // isDisliked?: boolean;

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

export interface GetPostResponse {
  post: Post;
}

export interface GetPostsResponse {
  posts: Post[];
  nextPage: number | undefined;
}

export interface GetCommentsResponse {
  comments: Comment[];
  nextPage: number | undefined;
}
