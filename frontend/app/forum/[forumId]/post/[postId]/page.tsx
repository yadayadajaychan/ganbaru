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
import CommentPopover from '@/components/comment/create';
import PostCard from '@/components/cards/post';
import Post from '@/components/post/post';

export default async function PostPage({
  params,
}: {
  params: { postId: string; forumId: string };
}) {
  return (
    <Flex
      justify='start'
      align='center'
      className='min-h-screen'
      direction='column'
      gap='9'
    >
      <Flex
        justify='start'
        direction='column'
        gap='4'
        className='w-full px-4 md:max-w-3xl'
      >
        <Post forumId={params.forumId} postId={params.postId} />
        <CommentPopover forumId={params.forumId} postId={params.postId} />
        <CommentContainer forumId={params.forumId} postId={params.postId} />
      </Flex>
    </Flex>
  );
}
