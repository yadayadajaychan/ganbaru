'use client';

import { Button, Dialog, Flex, Text, TextField } from '@radix-ui/themes';
import { useState } from 'react';

interface JoinClassProps {
  title?: string;
}

export default function JoinClass({
  title = 'Join Another Class',
}: JoinClassProps) {
  const [code, setCode] = useState('');

  const onSubmit = async () => {};

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button variant='soft' size='2' className='hover:cursor-pointer'>
          {title}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Join Class</Dialog.Title>
        <Dialog.Description>
          Join a class by entering the class code below.
        </Dialog.Description>
        <Flex mt='4'>
          <TextField.Root
            size='2'
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder='Enter a join code'
          />
        </Flex>
        <Flex justify='end'>
          <Button
            variant='outline'
            size='2'
            className='hover:cursor-pointer'
            onClick={onSubmit}
          >
            Join
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
