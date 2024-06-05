'use client';

import { useState } from 'react';
import {
  Badge,
  Box,
  Card,
  Flex,
  Separator,
  Skeleton,
  Text,
} from '@radix-ui/themes';
import {
  ThickArrowUpIcon,
  ThickArrowDownIcon,
  ChatBubbleIcon,
} from '@radix-ui/react-icons';

import { Post } from '@/types';
import { MarkdownToJsx } from '../markdown';
import Link from 'next/link';
import { sendVote } from '@/api/post';

interface PostCardProps {
  classId: string;
  post: Post;
  preview?: boolean;
  loading?: boolean;
  redirect?: boolean;
}

export default function PostCard({
  classId,
  post,
  preview = false,
  loading = false,
  redirect = true,
}: PostCardProps) {
  const [likeStatus, setLikeStatus] = useState<{
    isLiked: boolean;
    isDisliked: boolean;
  }>({ isLiked: post.vote === 1, isDisliked: post.vote === -1 });

  const [likeCount, setLikeCount] = useState(post.score);

  const handleUpvote = async () => {
    if (loading) return;

    if (likeStatus.isLiked) {
      await sendVote({
        forumId: classId,
        postId: post.post_id.toString(),
        vote: 0,
      });

      setLikeStatus({ isLiked: false, isDisliked: false });
      setLikeCount(likeCount - 1);
    } else if (likeStatus.isDisliked) {
      await sendVote({
        forumId: classId,
        postId: post.post_id.toString(),
        vote: 1,
      });

      setLikeStatus({ isLiked: true, isDisliked: false });
      setLikeCount(likeCount + 2);
    } else {
      await sendVote({
        forumId: classId,
        postId: post.post_id.toString(),
        vote: 1,
      });

      setLikeStatus({ isLiked: true, isDisliked: false });
      setLikeCount(likeCount + 1);
    }
  };

  const handleDownvote = async () => {
    if (loading) return;

    if (likeStatus.isLiked) {
      await sendVote({
        forumId: classId,
        postId: post.post_id.toString(),
        vote: -1,
      });

      setLikeStatus({ isLiked: false, isDisliked: false });
      setLikeCount(likeCount - 2);
    } else if (likeStatus.isDisliked) {
      await sendVote({
        forumId: classId,
        postId: post.post_id.toString(),
        vote: 0,
      });

      setLikeStatus({ isLiked: false, isDisliked: false });
      setLikeCount(likeCount + 1);
    } else {
      await sendVote({
        forumId: classId,
        postId: post.post_id.toString(),
        vote: -1,
      });

      setLikeStatus({ isLiked: false, isDisliked: true });
      setLikeCount(likeCount - 1);
    }
  };

  return (
    <Box className={`${preview ? 'hover:cursor-pointer' : ''} w-full`}>
      <Card size='2'>
        <Flex id='left' direction='column' justify='start' gap='2'>
          <Link href={`/forum/${classId}/post/${post.post_id}`}>
            <Flex id='user' direction='row' justify='between'>
              <Flex direction='row' gap='2'>
                <Text color='gray' size='2'>
                  <Skeleton loading={loading}>
                    Posted by: {post.user.name}
                  </Skeleton>
                </Text>
                {post.instructor_answered && !loading && (
                  <Badge color='green'>Instructor Answered</Badge>
                )}
              </Flex>
              <Text color='gray' size='1'>
                <Skeleton loading={loading}>
                  {new Date(post.date).toLocaleTimeString()}
                </Skeleton>
              </Text>
            </Flex>
            <Flex id='content' direction='column' gap={preview ? '1' : '3'}>
              <Flex
                style={{
                  height: preview ? '30px' : undefined,
                  overflow: 'hidden',
                }}
              >
                <Text
                  as='label'
                  weight='bold'
                  size={preview ? '3' : '5'}
                  truncate={preview ? true : false}
                  style={{
                    whiteSpace: 'normal',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  className={preview ? 'hover:cursor-pointer' : ''}
                >
                  <Skeleton loading={loading}>{post.title}</Skeleton>
                </Text>
              </Flex>
              <Flex
                style={{
                  height: preview ? '80px' : undefined,
                  overflow: 'hidden',
                }}
              >
                {loading ? (
                  <Skeleton loading={true}>
                    <Text>{post.full_text}</Text>
                  </Skeleton>
                ) : (
                  <MarkdownToJsx markdown={post.full_text} />
                )}
              </Flex>
            </Flex>
          </Link>
          <Separator orientation='horizontal' mt={'2'} size='4' />
          <Flex
            id='controls'
            direction='row'
            justify='start'
            align='center'
            gap='3'
          >
            <Box
              id='likes'
              style={{
                background: 'var(--gray-a3)',
                borderRadius: 'var(--radius-3)',
              }}
              className='py-1 px-2'
            >
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
            </Box>
            {preview && (
              <Box
                id='comments'
                style={{
                  background: 'var(--gray-a3)',
                  borderRadius: 'var(--radius-3)',
                }}
                className='py-1 px-2'
              >
                <Flex
                  gap='2'
                  direction='row'
                  justify='start'
                  align='center'
                  className='hover:cursor-pointer'
                >
                  <ChatBubbleIcon className='hover:cursor-pointer' />
                  <Text as='label' size='2' className='hover:cursor-pointer'>
                    {post.answers}
                  </Text>
                </Flex>
              </Box>
            )}
          </Flex>
        </Flex>
      </Card>
    </Box>
  );
}
