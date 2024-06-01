import { useEffect, useState } from 'react';
import { GetCommentsResponse } from '@/types';
import { Button, Flex, Popover } from '@radix-ui/themes';
import CommentCreate from '@/components/create';

import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { fetchComments } from '@/api/comment';
import CommentContainer from '@/components/comment/container';
import { ChatBubbleIcon } from '@radix-ui/react-icons';
import { AutoSizer } from 'react-virtualized';
import CommentPopover from '@/components/comment/popover';
import PostCard from '@/components/cards/post';

export default async function Post({ params }: { params: { id: string } }) {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['comments', { id: params.id }],
    queryFn: fetchComments,
    initialPageParam: 1,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Flex
        justify='center'
        align='center'
        className='min-h-screen'
        direction='column'
        gap='9'
      >
        <Flex justify='start' direction='column' gap='4'>
          <PostCard
            post={{
              user: 'anonymous12345',
              title: 'test',
              description: 'test',
              likes: 0,
              comments: 0,
              datePosted: new Date(),
            }}
            preview={false}
          />
          <CommentPopover postId={params.id} />
          <CommentContainer postId={params.id} />
        </Flex>
      </Flex>
    </HydrationBoundary>
  );
}
