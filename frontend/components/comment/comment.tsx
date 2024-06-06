import type { Comment } from '@/types';
import { useEffect, useState } from 'react';
import { Flex, Separator, Skeleton, Text } from '@radix-ui/themes';

import { ThickArrowUpIcon, ThickArrowDownIcon } from '@radix-ui/react-icons';
import { MarkdownToJsx } from '../markdown';
import { voteComment } from '@/api/comment';

interface CommentProps {
  comment: Comment;
  classId: string;
  postId: string;
  loading?: boolean;
}

// the comment itself that is displaye on a post
export default function Comment({
  comment,
  loading = false,
  classId,
  postId,
}: CommentProps) {
  const [likeStatus, setLikeStatus] = useState<{
    isLiked: boolean;
    isDisliked: boolean;
  }>({ isLiked: comment.vote == 1, isDisliked: comment.vote == -1 });

  const [likeCount, setLikeCount] = useState(comment.score);

  useEffect(() => {
    setLikeStatus({
      isLiked: comment.vote == 1,
      isDisliked: comment.vote == -1,
    });
    setLikeCount(comment.score);
  }, [comment]);

  const handleUpvote = async () => {
    if (loading) return;

    if (likeStatus.isLiked) {
      await voteComment({
        classId: Number(classId),
        postId: Number(postId),
        commentId: comment.answer_id,
        vote: 0,
      });

      setLikeStatus({ isLiked: false, isDisliked: false });
      setLikeCount(likeCount - 1);
    } else if (likeStatus.isDisliked) {
      await voteComment({
        classId: Number(classId),
        postId: Number(postId),
        commentId: comment.answer_id,
        vote: 1,
      });

      setLikeStatus({ isLiked: true, isDisliked: false });
      setLikeCount(likeCount + 2);
    } else {
      await voteComment({
        classId: Number(classId),
        postId: Number(postId),
        commentId: comment.answer_id,
        vote: 1,
      });

      setLikeStatus({ isLiked: true, isDisliked: false });
      setLikeCount(likeCount + 1);
    }
  };

  const handleDownvote = async () => {
    if (loading) return;

    if (likeStatus.isLiked) {
      await voteComment({
        classId: Number(classId),
        postId: Number(postId),
        commentId: comment.answer_id,
        vote: -1,
      });

      setLikeStatus({ isLiked: false, isDisliked: true });
      setLikeCount(likeCount - 2);
    } else if (likeStatus.isDisliked) {
      await voteComment({
        classId: Number(classId),
        postId: Number(postId),
        commentId: comment.answer_id,
        vote: 0,
      });

      setLikeStatus({ isLiked: false, isDisliked: false });
      setLikeCount(likeCount + 1);
    } else {
      await voteComment({
        classId: Number(classId),
        postId: Number(postId),
        commentId: comment.answer_id,
        vote: -1,
      });

      setLikeStatus({ isLiked: false, isDisliked: true });
      setLikeCount(likeCount - 1);
    }
  };
  return (
    <Flex direction='column' gap='4'>
      <Flex id='user' direction='row' gap='4' justify='start' align='center'>
        <Text size='2' weight='bold'>
          <Skeleton loading={loading}>{comment.user.name}</Skeleton>
        </Text>
        <Separator orientation='vertical' size='1' />
        <Text size='1'>
          <Skeleton loading={loading}>
            {new Date(comment.date).toLocaleTimeString()}
          </Skeleton>
        </Text>
      </Flex>
      <Flex
        direction='column'
        gap='2'
        className='border-l-2 border-[var(--gray-5)] pl-4'
      >
        {loading ? (
          <Skeleton loading={true}>
            <Text>{comment.answer}</Text>
          </Skeleton>
        ) : (
          <MarkdownToJsx markdown={comment.answer} />
        )}
      </Flex>
      <Flex gap='3' justify='start' align='center'>
        <Flex direction='row' justify='start' align='center' gap='1'>
          <ThickArrowUpIcon
            className={`hover:cursor-pointer icon-hover ${
              likeStatus.isLiked ? 'liked' : ''
            }`}
            onClick={handleUpvote}
          />
          <Text as='label' size='2'>
            <Skeleton loading={loading}>{likeCount}</Skeleton>
          </Text>
        </Flex>
        <ThickArrowDownIcon
          className={`hover:cursor-pointer icon-hover ${
            likeStatus.isDisliked ? 'disliked' : ''
          }`}
          onClick={handleDownvote}
        />
      </Flex>
    </Flex>
  );
}
