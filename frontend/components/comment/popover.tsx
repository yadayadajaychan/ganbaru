'use client';

import CommentCreate from '@/components/comment/create';
import { ChatBubbleIcon } from '@radix-ui/react-icons';
import { Button, Inset, Popover } from '@radix-ui/themes';
import { AutoSizer } from 'react-virtualized';
import { useState } from 'react';

interface CommentPopoverProps {
  postId: string;
}

export default function CommentPopover({ postId }: CommentPopoverProps) {
  const [text, setText] = useState('');

  return (
    <Popover.Root>
      <Popover.Trigger>
        <Button variant='soft'>
          <ChatBubbleIcon width='16' height='16' />
          Add a Comment
        </Button>
      </Popover.Trigger>
      <Popover.Content size='4'>
        {/* small hack to lower the padding */}
        <Inset className='p-4'>
          <AutoSizer disableHeight={true}>
            {({ width }) => (
              <CommentCreate
                text={text}
                setText={setText}
                postId={postId}
                width={width}
              />
            )}
          </AutoSizer>
        </Inset>
      </Popover.Content>
    </Popover.Root>
  );
}
