'use client';

import {
  Flex,
  Card,
  Heading,
  Box,
  Text,
  TextField,
  Link,
  Button,
} from '@radix-ui/themes';
import { useState } from 'react';

export default function LoginCard() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Flex flexShrink='0' direction='column' gap='6' width='416px'>
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
            <Link href='#' size='2' onClick={(e) => e.preventDefault()}>
              Forgot password?
            </Link>
          </Flex>
          <TextField.Root
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Enter your password'
          />
        </Flex>

        <Flex mt='6' justify='end' gap='3'>
          <Button className='hover:cursor-pointer' variant='outline'>
            Create an account
          </Button>
          <Button className='hover:cursor-pointer'>Sign in</Button>
        </Flex>
      </Card>
    </Flex>
  );
}
