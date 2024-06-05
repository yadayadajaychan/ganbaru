import type { Comment } from '@/types';
import { useState } from 'react';
import { Flex, Separator, Skeleton, Text } from '@radix-ui/themes';

import { ThickArrowUpIcon, ThickArrowDownIcon } from '@radix-ui/react-icons';
import { MarkdownToJsx } from '../markdown';

interface CommentProps {
  comment: Comment;
  loading?: boolean;
}

// the comment itself that is displaye on a post
export default function Comment({ comment, loading = false }: CommentProps) {
  const [likeStatus, setLikeStatus] = useState<{
    isLiked: boolean;
    isDisliked: boolean;
  }>({ isLiked: comment.vote === 1, isDisliked: comment.vote === -1 });

  const [likeCount, setLikeCount] = useState(comment.score);

  const sendVoteRequest = async (postId: string, voteType: string) => {
    try {
      const response = await fetch(`/api/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId, voteType }),
      });

      if (!response.ok) {
        throw new Error('Failed to vote');
      }

      const data = await response.json();
      return data.newScore;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const handleUpvote = async () => {
    const newScore = await sendVoteRequest(
      comment.answer_id.toString(),
      'upvote'
    );

    if (newScore !== null) {
      if (likeStatus.isLiked) {
        setLikeStatus({ isLiked: false, isDisliked: false });
        setLikeCount(newScore);
      } else {
        setLikeStatus({ isLiked: true, isDisliked: false });
        setLikeCount(newScore);
      }
    }
  };

  const handleDownvote = async () => {
    const newScore = await sendVoteRequest(
      comment.answer_id.toString(),
      'downvote'
    );
    if (newScore !== null) {
      if (likeStatus.isDisliked) {
        setLikeStatus({ isLiked: false, isDisliked: false });
        setLikeCount(newScore);
      } else {
        setLikeStatus({ isLiked: false, isDisliked: true });
        setLikeCount(newScore);
      }
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
