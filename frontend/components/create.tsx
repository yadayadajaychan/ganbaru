'use client';

import {
  FontItalicIcon,
  FontBoldIcon,
  HeadingIcon,
  CaretRightIcon,
  CodeIcon,
  ChatBubbleIcon,
} from '@radix-ui/react-icons';
import {
  Box,
  Card,
  Flex,
  Heading,
  IconButton,
  TextArea,
  Button,
  Text,
  Dialog,
  Popover,
  Switch,
} from '@radix-ui/themes';
import { Label } from '@radix-ui/react-label';
import { useState } from 'react';

import Comment from './comment/comment';

import ReactMarkdown from 'react-markdown';
import { MarkdownToJsx } from './markdown';
import MDEditor from '@uiw/react-md-editor';
import { useTheme } from 'next-themes';
import PostCard from './cards/post';

interface CreateProps {
  width?: number;

  title?: string;

  text: string;
  setText: (text: string) => void;

  anonymous: boolean;
  setAnonymous: (anonymous: boolean) => void;

  onSubmit: () => Promise<void>;

  type: 'comment' | 'post';
}

export default function Create({
  width,
  title,
  text,
  setText,
  onSubmit,
  type,
}: CreateProps) {
  // const insertMarkdown = (
  //   beforeSyntax: string,
  //   afterSyntax: string,
  //   placeholder: string
  // ) => {
  //   const textarea = document.getElementById(
  //     'comment-textarea'
  //   ) as HTMLTextAreaElement;
  //   const start = textarea.selectionStart;
  //   const end = textarea.selectionEnd;
  //   const before = text.substring(0, start);
  //   const selectedText = text.substring(start, end) || placeholder;
  //   const after = text.substring(end, text.length);
  //   setText(before + beforeSyntax + selectedText + afterSyntax + after);
  //   textarea.focus();
  //   textarea.setSelectionRange(
  //     start + beforeSyntax.length,
  //     end +
  //       beforeSyntax.length +
  //       (selectedText === placeholder ? placeholder.length : 0)
  //   );
  // };
  const { theme } = useTheme();

  return (
    <Flex direction='column' gap='4' width={width ? `${width}px` : '100%'}>
      <Flex direction='row' gap='4' className='w-full'>
        <Box className='w-full'>
          <Flex direction='column' gap='2' className='w-full'>
            <div data-color-mode={theme}>
              <MDEditor
                value={text}
                preview='edit'
                onChange={(e) => setText(e ?? '')}
              />
            </div>
          </Flex>
        </Box>
      </Flex>
      <Text as='label' size='2'>
        <Flex gap='2'>
          <Switch size='1' /> Stay Anonymous
        </Flex>
      </Text>
      <Flex className='w-full' gap='4' justify='end'>
        <Dialog.Root>
          <Dialog.Trigger>
            <Button className='hover:cursor-pointer' variant='outline'>
              Preview
            </Button>
          </Dialog.Trigger>
          <Dialog.Content size='2'>
            {type === 'comment' ? (
              <Comment
                comment={{
                  id: '1',
                  content: text,
                  postId: '',
                  createdAt: new Date(),
                  likeCount: 1,
                  user: {
                    id: 1,
                    name: 'test',
                  },
                }}
              />
            ) : (
              <PostCard
                post={{
                  title: title ?? 'My first post',
                  description: text,
                  user: 'test',
                  likes: 1,
                  comments: 1,
                  datePosted: new Date(),
                }}
                preview={false}
              />
            )}
          </Dialog.Content>
        </Dialog.Root>
        <Button
          className='hover:cursor-pointer'
          variant='soft'
          onClick={onSubmit}
        >
          {type === 'comment' ? 'Post' : 'Create'}{' '}
          {type === 'comment' ? 'Comment' : 'Post'}
        </Button>
      </Flex>
    </Flex>
  );
}
