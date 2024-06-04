import PostCard from '@/components/cards/post';
import Create from '@/components/create';
import NavBar from '@/components/nav/navbar';
import PostContainer from '@/components/post/container';
import PostCreate from '@/components/post/create';
import { PlusIcon } from '@radix-ui/react-icons';
import { Dialog, Flex, IconButton } from '@radix-ui/themes';

export default function Forum({ params }: { params: { forumId: string } }) {
  return (
    <>
      <Flex gap='20' direction='column' justify='start' align='center'>
        <PostContainer />
        {/* bottom right */}
        <Flex
          position='fixed'
          gap='20'
          direction='column'
          bottom='50px'
          right='50px'
        >
          <PostCreate />
        </Flex>
      </Flex>
    </>
  );
}
