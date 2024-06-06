'use client';

import {
  Card,
  Flex,
  Select,
  Separator,
  Spinner,
  TextField,
  Text,
} from '@radix-ui/themes';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  AutoSizer,
  WindowScroller,
  InfiniteLoader,
  List,
  CellMeasurerCache,
  CellMeasurer,
} from 'react-virtualized';
import {
  InfiniteData,
  InfiniteQueryObserverResult,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { fetchPosts } from '@/api/post';
import PostCard from '../cards/post';
import { Crosshair2Icon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import InfiniteScroll from 'react-infinite-scroller';
import PostSkeleton from './skeleton';

interface PostContainerProps {
  forumId: string;
  mainLoading?: boolean;
}

// will be the virtualized list that contains all of the posts
export default function PostContainer({
  forumId,
  mainLoading = false,
}: PostContainerProps) {
  const filterData = {
    all: { label: 'All' },
    unanswered: { label: 'Unanswered' },
  };

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all' as keyof typeof filterData);

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const [isNextPageLoading, setIsNextPageLoading] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['posts', debouncedSearch, filter, forumId],
    queryFn: ({ pageParam }) =>
      fetchPosts({
        pageParam,
        search: debouncedSearch,
        filter,
        forumId: Number(forumId),
      }),
    getNextPageParam: (lastPage) => lastPage.next_page,
    initialPageParam: 1,
  });

  const allRecords = data ? data.pages.map((page) => page.post_infos) : [];
  const posts = allRecords.flat();

  const loadMoreRows = async () => {
    if (isNextPageLoading) {
      return;
    }

    setIsNextPageLoading(true);
    await fetchNextPage();
    setIsNextPageLoading(false);
  };

  return (
    // <Card size='5'>
    <Flex gap='4' direction='column' justify='center' className='w-full'>
      <Flex direction='row' justify='between' className='w-full' gap='2'>
        <TextField.Root
          placeholder='Search for a specific post...'
          className='w-full'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        >
          <TextField.Slot>
            <MagnifyingGlassIcon height='16' width='16' />
          </TextField.Slot>
        </TextField.Root>
        <Select.Root
          defaultValue='all'
          value={filter}
          onValueChange={(value) => setFilter(value as keyof typeof filterData)}
        >
          <Select.Trigger>
            <Flex as='span' align='center' gap='2'>
              <Crosshair2Icon />
              {filterData[filter].label}
            </Flex>
          </Select.Trigger>
          <Select.Content>
            <Select.Item value='all'>All</Select.Item>
            <Select.Item value='unanswered'>Unanswered</Select.Item>
          </Select.Content>
        </Select.Root>
      </Flex>
      {!isLoading && posts.length === 0 && (
        <Flex justify='center' align='center'>
          <Text>No posts found. Be the first to create one!</Text>
        </Flex>
      )}
      {((isLoading && posts.length === 0) || mainLoading) && (
        <PostSkeleton forumId={forumId} preview={true} />
      )}
      <InfiniteScroll
        pageStart={1}
        loadMore={loadMoreRows}
        hasMore={hasNextPage}
        loader={
          <Flex justify='center' align='center'>
            <Spinner size='3' />
          </Flex>
        }
      >
        {posts.map((post) => (
          <Flex mb='5' key={post.post_id} className='w-full'>
            <PostCard classId={forumId} post={post} preview={true} />
          </Flex>
        ))}
      </InfiniteScroll>
    </Flex>
    // </Card>
  );
}
