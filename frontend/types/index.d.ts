

export interface Comment {
    id: string;
    content: string;
    postId: string;
    createdAt: Date;
    user: {
        id: number;
        name: string;
    };
}

export interface Post {
    user_id: number;
    title: string;
    date: string;
    views: number;
    answers: number;
    instructor_answered: boolean;
    tags: string[];
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
