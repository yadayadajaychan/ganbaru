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
} from '@radix-ui/themes';
import { useState } from 'react';
import NextLink from 'next/link';

export interface LoginProps {
  onCreateAccount: (
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => void;
}

export default function SignupCard({ onCreateAccount }: LoginProps) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <Flex flexShrink='0' direction='column' gap='6' width='416px'>
      <Card size='4'>
        <Heading as='h3' size='6' trim='start' mb='5'>
          Sign Up
        </Heading>

        <Flex justify='start' direction='column' gap='2' mb='5'>
          <Flex justify='between' direction='row'>
            <Text as='label' size='2' weight='bold'>
              Username
            </Text>
          </Flex>
          <TextField.Root
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder='Enter a unique username'
          />
        </Flex>

        <Flex justify='start' direction='column' gap='2' mb='5'>
          <Flex justify='between' direction='row'>
            <Text as='label' size='2' weight='bold'>
              Email
            </Text>
          </Flex>
          <TextField.Root
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Enter your email'
          />
        </Flex>

        <Flex justify='start' direction='column' gap='2' mb='2'>
          <Text as='label' size='2' weight='bold'>
            Password
          </Text>
          <TextField.Root
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Enter your password'
          />
          <TextField.Root
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder='Confirm your password'
          />
        </Flex>

        <Flex mt='6' direction='column' justify='end' gap='3'>
          <Link href='#' size='2' onClick={(e) => e.preventDefault()}>
            Already have an Account? Sign in Here.
          </Link>
          <Button className='hover:cursor-pointer'>Create Account</Button>
        </Flex>
      </Card>
    </Flex>
  );
}
