import SignupCard from '@/components/cards/signup';
import { Flex } from '@radix-ui/themes';

export default function Login() {
  return (
    <Flex justify='center' align='center' className='min-h-screen'>
      <SignupCard />
    </Flex>
  );
}
