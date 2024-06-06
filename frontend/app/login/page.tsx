import LoginCard from '@/components/cards/login';
import { Flex } from '@radix-ui/themes';

export default function Login() {
  return (
    <Flex justify='center' align='center' className='min-h-screen'>
      <LoginCard />
    </Flex>
  );
}
