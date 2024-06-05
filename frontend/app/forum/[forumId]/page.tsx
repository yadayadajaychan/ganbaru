'use client';

import { fetchClass } from '@/api/classes';
import PostCard from '@/components/cards/post';
import Create from '@/components/create';
import NavBar from '@/components/nav/navbar';
import PostContainer from '@/components/post/container';
import PostCreate from '@/components/post/create';
import { PlusIcon } from '@radix-ui/react-icons';
import { Dialog, Flex, IconButton } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';

export default function Forum({ params }: { params: { forumId: string } }) {
  const { error, isLoading } = useQuery({
    queryKey: ['forum', params.forumId],
    queryFn: () => fetchClass({ forumId: params.forumId }),
  });

  if (error) throw new Error(error.message);

  return (
    <>
      <Flex gap='20' direction='column' justify='start' align='center'>
        <Flex className='w-full px-4 md:max-w-3xl'>
          <PostContainer mainLoading={isLoading} forumId={params.forumId} />
        </Flex>
        {/* bottom right */}
        <Flex
          position='fixed'
          gap='20'
          direction='column'
          bottom='50px'
          right='50px'
        >
          <PostCreate classId={params.forumId} />
        </Flex>
      </Flex>
    </>
  );
}
