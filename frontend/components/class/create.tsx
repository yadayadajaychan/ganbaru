'use client';

import { createClass, joinClass } from '@/api/classes';
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

export default function CreateClass() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    setIsLoading(true);

    const res = await createClass({ name, description });

    if (!res.ok) {
      setIsLoading(false);
      toast.error('Failed to create class');
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
          Create a Class
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Create a Class</Dialog.Title>
        <Dialog.Description>Create a new class.</Dialog.Description>
        <Flex direction='column' gap='4'>
          <Flex mt='4' direction='column' gap='1'>
            <Text size='2'>Class Name</Text>
            <TextField.Root
              size='2'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Enter a class name'
            />
          </Flex>
          <Flex direction='column' gap='1'>
            <Text size='2'>Class Description</Text>
            <TextField.Root
              size='2'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Enter a class description'
            />
          </Flex>
          <Flex justify='end'>
            <Button
              variant='outline'
              size='2'
              className='hover:cursor-pointer'
              onClick={onSubmit}
            >
              {isLoading ? <Spinner /> : 'Create'}
            </Button>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
