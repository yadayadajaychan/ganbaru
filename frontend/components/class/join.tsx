'use client';

import { joinClass } from '@/api/classes';
import { JoinClassResponse } from '@/types';
import {
  Button,
  Dialog,
  Flex,
  Spinner,
  Text,
  TextField,
} from '@radix-ui/themes';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface JoinClassProps {
  title?: string;
}

export default function JoinClass({
  title = 'Join Another Class',
}: JoinClassProps) {
  const router = useRouter();

  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    setIsLoading(true);

    const res = await joinClass({ code });

    if (!res.ok) {
      setIsLoading(false);
      toast.error('Failed to join class');
      return;
    }

    const data: JoinClassResponse = await res.json();

    setIsLoading(false);
    router.push(`/forum/${data.forum_id}`);
  };

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
            {isLoading ? <Spinner /> : 'Join'}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
