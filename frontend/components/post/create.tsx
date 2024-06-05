'use client';

import { PlusIcon } from '@radix-ui/react-icons';
import {
  Dialog,
  IconButton,
  Flex,
  Heading,
  Text,
  TextField,
  Switch,
} from '@radix-ui/themes';
import Create from '../create';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { createPost } from '@/api/post';
import { CreatePostResponse } from '@/types';
import { useRouter } from 'next/navigation';

export default function PostCreate({ classId }: { classId: string }) {
  const router = useRouter();
  const [text, setText] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [title, setTitle] = useState('');

  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    if (!text.length) {
      toast.error('Comment cannot be empty');
      return;
    }

    // Assuming you have an API endpoint for creating posts
    const response = await createPost({
      forumId: classId,
      title,
      fullText: text,
      tags: [],
      anonymous,
    });

    if (response.ok) {
      const res: CreatePostResponse = await response.json();

      setText('');
      setOpen(false);
      toast.success('Post created!');

      router.push(`/forum/${classId}/post/${res.post_id}`);
    } else {
      console.error('Failed to create post');
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <IconButton
          radius='full'
          variant='soft'
          size='4'
          className='hover:cursor-pointer'
        >
          <PlusIcon width={25} height={25} />
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Content className='z-[9998]'>
        <Flex direction='column' gap='6'>
          <Heading>Create Post</Heading>
          <Flex direction='column' gap='4'>
            <Flex direction='column' gap='2'>
              <Text weight='bold' size='2'>
                Title
              </Text>
              <TextField.Root
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                size='2'
                placeholder='My first post...'
              />
            </Flex>
            <Flex direction='column' gap='2'>
              <Text weight='bold' size='2'>
                Content
              </Text>
              <Create
                title={title}
                text={text}
                setText={setText}
                type='post'
                onSubmit={handleSubmit}
                anonymous={anonymous}
                setAnonymous={setAnonymous}
              />
            </Flex>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
