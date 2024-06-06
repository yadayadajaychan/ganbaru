'use client';

import { updateUsername } from '@/api/user';
import { useSession } from '@/util/session';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Button, Flex, Spinner, Text, TextField } from '@radix-ui/themes';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Settings() {
  const session = useSession();

  const [user, setUser] = useState(session.username);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    setIsLoading(true);
    const resp = await updateUsername({ username: user });
    if (!resp.ok) {
      if (resp.status === 400) {
        const res = await resp.json();
        toast.error(res.message);
      } else {
        toast.error('Failed to update username');
      }
    } else {
      toast.success('Username updated!');
    }

    setIsLoading(false);
  };

  return (
    <Flex className='w-full h-full' direction='column' gap='8'>
      <Text as='label' size='2'>
        Username
        <TextField.Root
          value={user}
          onChange={(e) => setUser(e.target.value)}
          mt='1'
          placeholder='Username'
          size='2'
          className='w-full'
        />
      </Text>
      <Flex justify='end'>
        <Button
          className='hover:cursor-pointer'
          size='2'
          variant='soft'
          onClick={onSubmit}
        >
          {isLoading ? <Spinner /> : 'Save Settings'}
        </Button>
      </Flex>
    </Flex>
  );
}
