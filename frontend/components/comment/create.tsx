'use client';

import {
  FontItalicIcon,
  FontBoldIcon,
  HeadingIcon,
  CaretRightIcon,
  CodeIcon,
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
} from '@radix-ui/themes';
import { Label } from '@radix-ui/react-label';
import { useState } from 'react';

import ReactMarkdown from 'react-markdown';
import { MarkdownToJsx } from '../markdown';

interface CommentCreateProps {
  postId: string;
}

export default function CommentCreate({ postId }: CommentCreateProps) {
  const [text, setText] = useState('');

  const insertMarkdown = (
    beforeSyntax: string,
    afterSyntax: string,
    placeholder: string
  ) => {
    const textarea = document.getElementById(
      'comment-textarea'
    ) as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = text.substring(0, start);
    const selectedText = text.substring(start, end) || placeholder;
    const after = text.substring(end, text.length);
    setText(before + beforeSyntax + selectedText + afterSyntax + after);
    textarea.focus();
    textarea.setSelectionRange(
      start + beforeSyntax.length,
      end +
        beforeSyntax.length +
        (selectedText === placeholder ? placeholder.length : 0)
    );
  };

  return (
    <Card size='2'>
      <Heading as='h3' size='3' mb='4'>
        Add a Comment
      </Heading>
      <Flex direction='column' gap='4'>
        <Flex direction='row' gap='4'>
          <Box>
            <Card>
              <Flex direction='column' gap='2' width='616px'>
                <Box>
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
                        onClick={() => insertMarkdown('`', '`', 'code')}
                      >
                        <CodeIcon />
                      </IconButton>
                    </Flex>
                  </Flex>
                </Box>
                <TextArea
                  id='comment-textarea'
                  spellCheck={false}
                  variant='classic'
                  resize='vertical'
                  rows={5}
                  placeholder='Start typing here...'
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </Flex>
            </Card>
          </Box>
          {/* <Card>
            <Flex width='416px' height='400px' maxWidth='416px'>
              <Box width='416px'>
                <MarkdownToJsx markdown={text} />
              </Box>
            </Flex>
          </Card> */}
        </Flex>
        <Flex className='w-full' gap='4' justify='end'>
          <Dialog.Root>
            <Dialog.Trigger>
              <Button variant='outline'>Preview</Button>
            </Dialog.Trigger>
            <Dialog.Content size='2'>
              <MarkdownToJsx markdown={text} />
            </Dialog.Content>
          </Dialog.Root>
          <Button variant='soft'>Post Comment</Button>
        </Flex>
      </Flex>
    </Card>
  );
}
