'use client';

import CommentCreate from '@/components/create';
import { ChatBubbleIcon } from '@radix-ui/react-icons';
import { Button, Inset, Popover } from '@radix-ui/themes';
import { AutoSizer } from 'react-virtualized';
import { useState } from 'react';

interface CommentPopoverProps {
  postId: string;
}

export default function CommentPopover({ postId }: CommentPopoverProps) {
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) return;

    // Assuming you have an API endpoint for creating comments
    const response = await fetch(`/forums/${forumId}/${postId}/create`, { //We do not know where forumID variable is.
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        answer: "answer"
      }),
    });

    if (response.ok) {
      // Handle success (e.g., clear the text and close the popover)
      setText('');
      setOpen(false);
      // Optionally, you could also refresh the comments list or add the new comment to the state
    } else {
      // Handle error
      console.error('Failed to create comment');
    }
  };

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
                width={width}
                type='comment'
              />
            )}
          </AutoSizer>
        </Inset>
      </Popover.Content>
    </Popover.Root>
  );
}
