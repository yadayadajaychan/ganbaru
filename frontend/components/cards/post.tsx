'use client';

import { useState } from 'react';
import { Box, Card, Flex, Separator, Text } from '@radix-ui/themes';
import {
  ThickArrowUpIcon,
  ThickArrowDownIcon,
  ChatBubbleIcon,
} from '@radix-ui/react-icons';

import { Post } from '@/types';
import { MarkdownToJsx } from '../markdown';

interface PostCardProps {
  post: Post;
  preview?: boolean;
}

export default function PostCard({ post, preview = false }: PostCardProps) {
  const [likeStatus, setLikeStatus] = useState<{
    isLiked: boolean;
    isDisliked: boolean;
  }>({ isLiked: post.vote === 1, isDisliked: post.vote === -1 });

  const [likeCount, setLikeCount] = useState(post.score);

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
    const newScore = await sendVoteRequest(post.post_id.toString(), 'upvote');

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
    const newScore = await sendVoteRequest(post.post_id.toString(), 'downvote');
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
    <Box className={`${preview ? 'hover:cursor-pointer' : ''}`}>
      <Card size='2'>
        <Flex id='left' direction='column' justify='start' gap='2'>
          <Flex id='user' direction='row' justify='between'>
            <Text color='gray' size='2'>
              Posted by: {post.user.name}
            </Text>
            <Text color='gray' size='1'>
              {new Date(post.date).toLocaleTimeString()}
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
                {post.title}
              </Text>
            </Flex>
            <Flex
              style={{
                height: preview ? '80px' : undefined,
                overflow: 'hidden',
              }}
            >
              <MarkdownToJsx markdown={post.content} />
            </Flex>
          </Flex>
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
                    {likeCount}
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
                    {post.score}
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
