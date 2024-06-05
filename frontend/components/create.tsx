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
  Spinner,
} from '@radix-ui/themes';
import { Label } from '@radix-ui/react-label';
import { useState } from 'react';

import Comment from './comment/comment';

import ReactMarkdown from 'react-markdown';
import { MarkdownToJsx } from './markdown';
import MDEditor from '@uiw/react-md-editor';
import { useTheme } from 'next-themes';
import { useSession } from '@/util/session';
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
  anonymous,
  setAnonymous,
}: CreateProps) {
  const { theme } = useTheme();

  const [isLoading, setIsLoading] = useState(false);

  const session = useSession();

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
          <Switch size='1' checked={anonymous} onCheckedChange={setAnonymous} />
          Stay Anonymous
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
                  answer_id: 1,
                  answer: text,
                  date: new Date(1000).toISOString(),
                  score: 1,
                  vote: 1,
                  user: {
                    uid: 1,
                    name: anonymous ? 'Anonymous' : session.username,
                  },
                }}
                classId='1'
                postId='1'
              />
            ) : (
              <PostCard
                post={{
                  title: title ?? 'My first post',
                  full_text: text,
                  user: {
                    name: anonymous ? 'Anonymous' : session.username,
                    uid: 1,
                  },
                  score: 1,
                  answers: 1,
                  date: new Date(1000).toISOString(),
                  post_id: 1,
                  last_activity: new Date(1000).toISOString(),
                  views: 1,
                  instructor_answered: false,
                  tags: [],
                  vote: 1,
                }}
                classId='5'
                preview={false}
              />
            )}
          </Dialog.Content>
        </Dialog.Root>
        <Button
          className='hover:cursor-pointer'
          variant='soft'
          onClick={async () => {
            setIsLoading(true);
            await onSubmit();
            setIsLoading(false);
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <Spinner />
          ) : (
            <>
              {type === 'comment' ? 'Post' : 'Create'}{' '}
              {type === 'comment' ? 'Comment' : 'Post'}
            </>
          )}
        </Button>
      </Flex>
    </Flex>
  );
}
