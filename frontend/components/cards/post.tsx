'use client';

import { useState } from 'react';
import { Box, Card, Flex, Separator, Text } from '@radix-ui/themes';
import {
  ThickArrowUpIcon,
  ThickArrowDownIcon,
  ChatBubbleIcon,
} from '@radix-ui/react-icons';

import './post.css';
import { Post } from '@/types';
import { MarkdownToJsx } from '../markdown';

export default function PostCard({
  title,
  description,
  user,
  likes,
  comments,
  datePosted,
  isLiked = false,
  isDisliked = false,
  preview = false,
}: Post) {
  const [likeStatus, setLikeStatus] = useState<{
    isLiked: boolean;
    isDisliked: boolean;
  }>({ isLiked, isDisliked });

  const [likeCount, setLikeCount] = useState(likes);

  const handleUpvote = () => {
    if (likeStatus.isLiked) {
      setLikeStatus({ isLiked: false, isDisliked: false });
      setLikeCount(likeCount - 1);
    } else {
      setLikeStatus({ isLiked: true, isDisliked: false });
      setLikeCount(likeStatus.isDisliked ? likeCount + 2 : likeCount + 1);
    }
  };

  const handleDownvote = () => {
    if (likeStatus.isDisliked) {
      setLikeStatus({ isLiked: false, isDisliked: false });
      setLikeCount(likeCount + 1);
    } else {
      setLikeStatus({ isLiked: false, isDisliked: true });
      setLikeCount(likeStatus.isLiked ? likeCount - 2 : likeCount - 1);
    }
  };

  return (
    <Box maxWidth='616px' className={preview ? 'hover:cursor-pointer' : ''}>
      <Card size='2'>
        <Flex id='left' direction='column' justify='start' gap='2'>
          <Flex id='user' direction='row' justify='between'>
            <Text color='gray' size='2'>
              Posted by: {user}
            </Text>
            <Text color='gray' size='2'>
              {datePosted.toLocaleTimeString()}
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
                  whiteSpace: 'normal', // Allows text wrapping
                  overflow: 'hidden', // Prevents content from spilling out
                  textOverflow: 'ellipsis', // Adds ellipsis when text overflows
                }}
                className={preview ? 'hover:cursor-pointer' : ''}
              >
                {title}
              </Text>
            </Flex>
            <Flex
              style={{
                height: preview ? '80px' : undefined,
                overflow: 'hidden', // Ensures content does not expand the box
              }}
            >
              <MarkdownToJsx markdown={description} />
            </Flex>
          </Flex>
          <Separator orientation='horizontal' size='4' />
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
                    {comments}
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
