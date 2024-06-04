'use client';

import SignupCard from '@/components/cards/signup';
import { Flex } from '@radix-ui/themes';

export default function Login() {
  const onCreateAccount = (email: string, password: string) => {};

  return (
    <Flex justify='center' align='center' className='min-h-screen'>
      <SignupCard onCreateAccount={onCreateAccount} />
    </Flex>
  );
}
