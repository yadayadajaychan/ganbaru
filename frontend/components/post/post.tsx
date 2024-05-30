import type { Post } from '@/types';

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </div>
  );
}
