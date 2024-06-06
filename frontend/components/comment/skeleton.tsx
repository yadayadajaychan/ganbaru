import { Comment as CommentType } from '@/types';
import { Flex } from '@radix-ui/themes';
import Comment from './comment';

export default function CommentSkeleton() {
  const exampleComment: CommentType = {
    answer: 'A bunch of random comments. A bunch of random comments. ',
    answer_id: 1,
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
          <Comment
            comment={comment}
            loading={true}
            classId={'1'}
            postId={'1'}
          />
        </Flex>
      ))}
    </Flex>
  );
}
