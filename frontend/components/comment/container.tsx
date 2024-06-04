'use client';

import { Comment as CommentType, Post } from '@/types';
import { Card, Flex, Separator, Spinner } from '@radix-ui/themes';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import Comment from './comment';
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
import InfiniteScroll from 'react-infinite-scroller';

interface CommentContainerProps {
  postId: string;
}

const cache = new CellMeasurerCache({
  fixedWidth: true,
  defaultHeight: 100,
});

// will be the virtualized list that contains all of the comments
export default function CommentContainer({ postId }: CommentContainerProps) {
  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['comments', postId],
    queryFn: async ({ pageParam }) => {
      const res = await fetch(`/api/xxx/${postId}?page=` + pageParam);
      return res.json();
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });

  const allRecords = data ? data.pages.map((page) => page.records) : [];
  const comments = allRecords.flat() as CommentType[];

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
    <Flex width='616px' direction='column' gap='2' justify='center' mb='5'>
      <InfiniteScroll
        pageStart={0}
        loadMore={loadMoreRows}
        hasMore={hasNextPage}
        loader={
          <Flex justify='center' align='center'>
            <Spinner size='3' />
          </Flex>
        }
      >
        {comments.map((comment) => (
          <Flex mb='5' key={comment.answer_id}>
            <Comment comment={comment} />
          </Flex>
        ))}
      </InfiniteScroll>
    </Flex>
  );
}
