'use client';

import {
  Flex,
  Card,
  Heading,
  Box,
  Text,
  TextField,
  Button,
  Link,
  Spinner,
} from '@radix-ui/themes';
import { useState } from 'react';
import NextLink from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { login } from '@/api/user';

export default function LoginCard() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    setIsLoading(true);

    const response = await login({ email, password });

    const resp = await response.json();

    if (!response.ok) {
      toast.error(resp.error ?? 'Unknown error');
      setIsLoading(false);
      return;
    }

    setIsLoading(false);

    toast.success('Success, redirecting...');

    setTimeout(() => {
      router.replace('/');
      router.refresh();
    }, 1000);
  };

  return (
    <Flex
      flexShrink='0'
      direction='column'
      gap='6'
      className='w-full px-4 md:max-w-3xl'
    >
      <Card size='4'>
        <Heading as='h3' size='6' trim='start' mb='5'>
          Sign In
        </Heading>

        <Flex justify='start' direction='column' gap='2' mb='5'>
          <Text as='label' size='2' weight='bold'>
            Email
          </Text>
          <TextField.Root
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Enter your email'
          />
        </Flex>

        <Flex justify='start' direction='column' gap='2'>
          <Flex justify='between' direction='row'>
            <Text as='label' size='2' weight='bold'>
              Password
            </Text>
          </Flex>
          <TextField.Root
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Enter your password'
          />
        </Flex>

        <Flex mt='6' justify='end' gap='3'>
          <NextLink href='/signup'>
            <Button className='hover:cursor-pointer' variant='outline'>
              Create an account{' '}
            </Button>
          </NextLink>
          <Button className='hover:cursor-pointer' onClick={onSubmit}>
            {isLoading ? <Spinner /> : 'Sign in'}
          </Button>
        </Flex>
      </Card>
    </Flex>
  );
}
