'use client';

import {
  FontItalicIcon,
  FontBoldIcon,
  StrikethroughIcon,
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  MagicWandIcon,
  ImageIcon,
  CrumpledPaperIcon,
} from '@radix-ui/react-icons';
import {
  Box,
  Card,
  Flex,
  Heading,
  IconButton,
  TextArea,
  Text,
  Button,
} from '@radix-ui/themes';
import { Label } from '@radix-ui/react-label';
import { useState } from 'react';

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
        <Box width='416px'>
          <Card>
            <Flex direction='column' gap='2'>
              <Box>
                <Flex gap='4'>
                  <Flex gap='1'>
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

                    <IconButton
                      variant='soft'
                      onClick={() =>
                        insertMarkdown('~~', '~~', 'strikethrough')
                      }
                    >
                      <StrikethroughIcon />
                    </IconButton>
                  </Flex>
                </Flex>
              </Box>
              <TextArea
                id='comment-textarea'
                spellCheck={false}
                variant='classic'
                rows={10}
                placeholder='Start typing here...'
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </Flex>
          </Card>
        </Box>
        <Button variant='soft'>Post Comment</Button>
      </Flex>
    </Card>
  );
}
