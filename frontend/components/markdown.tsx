import ReactMarkdown from 'react-markdown';

import {
  Box,
  Card,
  Flex,
  Heading,
  IconButton,
  TextArea,
  Button,
  Text,
  Em,
  Strong,
  Code,
  Blockquote,
} from '@radix-ui/themes';
import remarkBreaks from 'remark-breaks';

import rehypeRaw from 'rehype-raw';
import React from 'react';

export const MarkdownToJsx = ({ markdown }: { markdown: string }) => {
  return (
    <ReactMarkdown
      rehypePlugins={[rehypeRaw]}
      remarkPlugins={[remarkBreaks]}
      components={{
        h1: ({ children }) => (
          <Heading as='h1' size='4'>
            {children}
          </Heading>
        ),
        code: ({ children }) => <Code size='2'>{children}</Code>,
        blockquote: ({ children }) => (
          <Blockquote size='2'>{children}</Blockquote>
        ),
        em: ({ children }) => <Em>{children}</Em>,
        strong: ({ children }) => <Strong>{children}</Strong>,
        p: ({ children }) => (
          <Text as='p' size='2' wrap='pretty'>
            {children}
          </Text>
        ),
        br: () => <br />,
      }}
    >
      {markdown.replace(/\n/gi, '&nbsp; \n')}
    </ReactMarkdown>
  );
};
