'use client';

import { PlusIcon } from '@radix-ui/react-icons';
import { Dialog, IconButton, Flex, Heading, Text } from '@radix-ui/themes';
import Create from '../create';
import { useState } from 'react';

export default function PostCreate() {
  const [text, setText] = useState('');

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
