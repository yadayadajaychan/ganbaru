import PostCard from '@/components/cards/post';
import Classes from '@/components/class/classes';
import NavBar from '@/components/nav/navbar';
import { Card, Flex, Heading, Separator } from '@radix-ui/themes';

export default function Home() {
  return (
    <Flex
      direction='column'
      gap='1'
      className='min-h-screen w-full'
      justify='center'
      align='center'
    >
      <Card size='4'>
        <Flex width='616px' direction='column' gap='4'>
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
