'use client';

import CommentCreate from '@/components/create';
import { ChatBubbleIcon } from '@radix-ui/react-icons';
import { Button, Inset, Popover } from '@radix-ui/themes';
import { AutoSizer } from 'react-virtualized';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { createComment } from '@/api/comment';
import { QueryClient, useQueryClient } from '@tanstack/react-query';

interface CommentPopoverProps {
  forumId: string;
  postId: string;
}

export default function CommentPopover({
  forumId,
  postId,
}: CommentPopoverProps) {
  const [text, setText] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    if (!text.trim()) return;

    // Assuming you have an API endpoint for creating comments
    const response = await createComment({
      classId: Number(forumId),
      postId: Number(postId),
      content: text,
      anonymous,
    });

    if (response.ok) {
      setText('');
      setOpen(false);

      toast.success('Comment created!');

      void queryClient.refetchQueries({
        queryKey: ['comments'],
      });
    } else {
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
                onSubmit={handleSubmit}
                anonymous={anonymous}
                setAnonymous={setAnonymous}
              />
            )}
          </AutoSizer>
        </Inset>
      </Popover.Content>
    </Popover.Root>
  );
}
