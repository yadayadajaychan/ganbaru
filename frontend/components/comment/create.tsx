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
} from '@radix-ui/themes';
import { Label } from '@radix-ui/react-label';
import { useState } from 'react';

import Comment from './comment';

import ReactMarkdown from 'react-markdown';
import { MarkdownToJsx } from '../markdown';
import MDEditor from '@uiw/react-md-editor';
import { useTheme } from 'next-themes';

interface CommentCreateProps {
  postId: string;
  width: number;

  text?: string;
  setText?: (text: string) => void;
}

export default function CommentCreate({
  postId,
  width,
  text: propText,
  setText: propSetText,
}: CommentCreateProps) {
  const [internalText, setInternalText] = useState('');
  const text = propText !== undefined ? propText : internalText;
  const setText = propSetText !== undefined ? propSetText : setInternalText;

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
    <Flex direction='column' gap='4' width={`${width}px`}>
      <Flex direction='row' gap='4' className='w-full'>
        <Box className='w-full'>
          {/* <Card className='w-full'> */}
          <Flex direction='column' gap='2' className='w-full'>
            {/* <Box>
              <Flex gap='4'>
                <Flex gap='1'>
                  <IconButton
                    variant='soft'
                    onClick={() => insertMarkdown('# ', '', 'heading')}
                  >
                    <HeadingIcon />
                  </IconButton>
                  <IconButton
                    variant='soft'
                    onClick={() => insertMarkdown('*', '*', 'italic')}
                  >
                    <FontItalicIcon />
                  </IconButton>

                  <IconButton
                    variant='soft'
                    onClick={() => insertMarkdown('**', '**', 'bold')}
                  >
                    <FontBoldIcon />
                  </IconButton>
                </Flex>

                <Flex gap='1'>
                  <IconButton
                    variant='soft'
                    onClick={() => insertMarkdown('```', '```', 'code')}
                  >
                    <CodeIcon />
                  </IconButton>
                </Flex>
              </Flex>
            </Box> */}
            {/* <TextArea
              id='comment-textarea'
              spellCheck={false}
              variant='classic'
              resize='vertical'
              rows={10}
              placeholder='Start typing here...'
              value={text}
              onChange={(e) => setText(e.target.value)}
            /> */}
            <div data-color-mode={theme}>
              <MDEditor
                value={text}
                preview='edit'
                // extraCommands={[codePreview, customButton, commands.fullscreen]}
                onChange={(e) => setText(e ?? '')}
              />
            </div>
          </Flex>
          {/* </Card> */}
        </Box>
      </Flex>
      <Flex className='w-full' gap='4' justify='end'>
        <Dialog.Root>
          <Dialog.Trigger>
            <Button className='hover:cursor-pointer' variant='outline'>
              Preview
            </Button>
          </Dialog.Trigger>
          <Dialog.Content size='2'>
            <Comment
              comment={{
                id: '1',
                content: text,
                postId: postId,
                createdAt: new Date(),
                likeCount: 1,
                user: {
                  id: 1,
                  name: 'test',
                },
              }}
            />
          </Dialog.Content>
        </Dialog.Root>
        <Button className='hover:cursor-pointer' variant='soft'>
          Post Comment
        </Button>
      </Flex>
    </Flex>
  );
}
