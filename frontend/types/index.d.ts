

export interface Comment {
    id: string;
    content: string;
    postId: string;
    createdAt: Date;
    likeCount: number;
    user: {
        id: number;
        name: string;
    };
}

export interface Post {
    title: string;
    description: string;
    user: string;
    likes: number;
    comments: number;
    datePosted: Date;
  
    // user related
    isLiked?: boolean;
    isDisliked?: boolean;
  
    preview?: boolean;
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
