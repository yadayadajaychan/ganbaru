'use client';

import LoginCard from '@/components/cards/login';
import { Flex } from '@radix-ui/themes';

export default function Login() {
  const onSignIn = (email: string, password: string) => {};

  return (
    <Flex justify='center' align='center' className='min-h-screen'>
      <LoginCard onSignIn={onSignIn} />
    </Flex>
  );
}
