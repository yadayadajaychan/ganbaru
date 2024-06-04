'use client';

import { PlusIcon } from '@radix-ui/react-icons';
import { Dialog, IconButton, Flex, Heading, Text } from '@radix-ui/themes';
import Create from '../create';
import { useState } from 'react';

export default function PostCreate() {
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) return;

    // Assuming you have an API endpoint for creating posts
    const response = await fetch('/forums/0/create', { //We do not know where forumID variable is.
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: "title goes here",
        full_text: "full text goes here"
      }),
    });

    if (response.ok) {
      // Handle success (e.g., clear the text and close the dialog)
      setText('');
      setOpen(false);
      // Optionally, you could also refresh the posts list or add the new post to the state
    } else {
      // Handle error
      console.error('Failed to create post');
    }

    return (
      <Dialog.Root>
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
        <Dialog.Content>
          <Flex direction='column' gap='4'>
            <Heading>Create Post</Heading>
            <Flex direction='column' gap='2'>
              <Text weight='bold' size='2'>
                Content
              </Text>
              <Create text={text} setText={setText} type='post' />
            </Flex>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    );
  }
}

