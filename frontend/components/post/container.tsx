'use client';

import { Card, Flex, Separator, Spinner, TextField } from '@radix-ui/themes';
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
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import InfiniteScroll from 'react-infinite-scroller';

const cache = new CellMeasurerCache({
  fixedWidth: true,
  defaultHeight: 100,
});

// will be the virtualized list that contains all of the posts
export default function PostContainer() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['posts', search, filter],
    queryFn: ({ pageParam }) => fetchPosts({ pageParam, search, filter }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });

  const allRecords = data ? data.pages.map((page) => page.records) : [];
  const posts = allRecords.flat();

  const [isNextPageLoading, setIsNextPageLoading] = useState(false);

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
    <Flex width='616px' gap='2' direction='column' justify='center'>
      <TextField.Root placeholder='Search for a specific post...'>
        <TextField.Slot>
          <MagnifyingGlassIcon height='16' width='16' />
        </TextField.Slot>
      </TextField.Root>
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
          <Flex mb='5' key={post.id}>
            <PostCard post={post} preview={true} />
          </Flex>
        ))}
      </InfiniteScroll>
    </Flex>
    // </Card>
  );
}
