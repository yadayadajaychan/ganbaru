import { Post } from '@/types';
import { Flex } from '@radix-ui/themes';
import PostCard from '../cards/post';

interface PostSkeletonProps {
  preview?: boolean;
  forumId: string;
}

export default function PostSkeleton({ preview, forumId }: PostSkeletonProps) {
  const exampleComment: Post = {
    full_text:
      'A bunch of random words. A bunch of random words. A bunch of random words. A bunch of random words.',
    answers: 1,
    instructor_answered: false,
    last_activity: new Date(1000).toISOString(),
    post_id: 1,
    tags: [],
    title: 'A bunch of random words. A bunch of random words.',
    views: 5,
    preview: preview,
    date: new Date(1000).toISOString(),
    score: 1,
    vote: 1,
    user: {
      name: 'John Doe',
      uid: 0,
    },
  };

  const examples = new Array(10).fill(exampleComment);

  return (
    <Flex direction='column'>
      {examples.map((comment) => (
        <Flex mb='5' key={comment.answer_id}>
          <PostCard classId={forumId} post={comment} loading={true} />
        </Flex>
      ))}
    </Flex>
  );
}
