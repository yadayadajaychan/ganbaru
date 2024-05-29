'use client';

import { Comment as CommentType, Post } from '@/types';
import { Card, Flex } from '@radix-ui/themes';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Comment from './comment';
import {
  AutoSizer,
  WindowScroller,
  InfiniteLoader,
  List,
} from 'react-virtualized';
import {
  InfiniteData,
  InfiniteQueryObserverResult,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { fetchComments } from '@/api/comment';

interface CommentContainerProps {
  postId: string;
}

export default function CommentContainer({ postId }: CommentContainerProps) {
  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['comments', { id: postId }],
    queryFn: fetchComments,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });

  const allRecords = data ? data.pages.map((page) => page.records) : [];
  const comments = allRecords.flat(1);

  // will be the virtualized list that contains all of the comments
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);

  const isRowLoaded = ({ index }: { index: number }) => {
    return !!comments[index];
  };

  const handlePageLoad = async () => {
    setIsNextPageLoading(true);
    await fetchNextPage();
    setIsNextPageLoading(false);
  };

  const loadMoreRows = isNextPageLoading ? async () => {} : handlePageLoad;

  const rowRenderer = ({
    key,
    index,
  }: {
    key: string;
    index: number;
    style: any;
  }) => {
    return <Comment key={key} comment={comments[index]} />;
  };

  return (
    <Card size='5'>
      <Flex>
        {/* <AutoSizer disableHeight={true} disableWidth={true}>
          {({ width }) => ( */}
        <WindowScroller>
          {({ height, isScrolling, onChildScroll, scrollTop }) => (
            <InfiniteLoader
              isRowLoaded={isRowLoaded}
              loadMoreRows={loadMoreRows}
              rowCount={1000}
            >
              {({ onRowsRendered, registerChild }) => (
                <List
                  autoHeight
                  onRowsRendered={onRowsRendered}
                  ref={registerChild}
                  height={height}
                  isScrolling={isScrolling}
                  onScroll={onChildScroll}
                  rowCount={comments.length}
                  rowHeight={42}
                  rowRenderer={rowRenderer}
                  scrollTop={scrollTop}
                  width={416}
                />
              )}
            </InfiniteLoader>
          )}
        </WindowScroller>
        {/* )}
        </AutoSizer> */}
      </Flex>
    </Card>
  );
}
