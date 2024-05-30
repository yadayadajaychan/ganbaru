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
  Link,
} from '@radix-ui/themes';
import remarkBreaks from 'remark-breaks';

import rehypeRaw from 'rehype-raw';
import React from 'react';
import MDEditor from '@uiw/react-md-editor';

export const MarkdownToJsx = ({ markdown }: { markdown: string }) => {
  return (
    <ReactMarkdown
      // rehypePlugins={[rehypeRaw]}
      // remarkPlugins={[remarkBreaks]}
      components={{
        h1: ({ children }) => (
          <Heading as='h1' size='4'>
            {children}
          </Heading>
        ),
        code: ({ children }) => {
          console.log(typeof children); // Log outside JSX
          console.log(children);
          return (
            <Code size='2'>
              {typeof children === 'string'
                ? children.replaceAll('&nbsp; ', '')
                : children}
            </Code>
          );
        },
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
        a: ({ children, href }) => <Link href={href}>{children}</Link>,
      }}
    >
      {/* {markdown.replace(/\n/gi, '&nbsp; \n')} */}
      {markdown}
    </ReactMarkdown>
    // <MDEditor.Markdown
    //   components={{
    //     h1: ({ children }) => (
    //       <Heading as='h1' size='4'>
    //         {children}
    //       </Heading>
    //     ),
    //     code: ({ children }) => {
    //       console.log(typeof children); // Log outside JSX
    //       console.log(children);
    //       return (
    //         <Code size='2'>
    //           {typeof children === 'string'
    //             ? children.replaceAll('&nbsp; ', '')
    //             : children}
    //         </Code>
    //       );
    //     },
    //     em: ({ children }) => <Em>{children}</Em>,
    //     strong: ({ children }) => <Strong>{children}</Strong>,
    //     p: ({ children }) => (
    //       <Text as='p' size='2' wrap='pretty'>
    //         {children}
    //       </Text>
    //     ),
    //     br: () => <br />,
    //   }}
    //   source={markdown}
    // />
  );
};
