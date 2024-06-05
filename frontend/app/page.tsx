import PostCard from '@/components/cards/post';
import Classes from '@/components/class/classes';
import NavBar from '@/components/nav/navbar';
import { Card, Flex, Heading, Separator } from '@radix-ui/themes';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function Home() {
  const cookie = cookies();
  if (!cookie.get('session_id')) {
    return redirect('/login');
  }

  return (
    <Flex
      direction='column'
      gap='1'
      className='min-h-screen w-full'
      justify='center'
      align='center'
    >
      <Card size='4'>
        <Flex direction='column' gap='4' className='w-full px-4 md:max-w-3xl'>
          <Heading>Classes</Heading>
          <Separator size='4' />
          <Flex>
            <Classes />
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
}
