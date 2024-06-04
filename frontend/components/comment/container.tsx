'use client';

import { Comment as CommentType, Post } from '@/types';
import { Card, Flex, Separator } from '@radix-ui/themes';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
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
import { fetchComments } from '@/api/comment';
import { randomComments } from './randomComments';

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
    queryFn: ({ pageParam }) =>
      fetchComments({ pageParam, postId: Number(postId) }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });

  const allRecords = data ? data.pages.map((page) => page.records) : [];
  const comments = randomComments; //allRecords.flat();

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
    parent,
  }: {
    key: string;
    index: number;
    parent: any;
    style: any;
  }) => {
    return (
      <CellMeasurer
        key={key}
        cache={cache}
        parent={parent}
        columnIndex={0}
        rowIndex={index}
      >
        <Flex mb='5'>
          <Comment comment={comments[index]} />
        </Flex>
      </CellMeasurer>
    );
  };

  return (
    // <Card size='5'>
    <Flex width='616px'>
      <AutoSizer disableHeight={true}>
        {({ width }) => (
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
                    rowHeight={cache.rowHeight}
                    rowRenderer={rowRenderer}
                    scrollTop={scrollTop}
                    width={width}
                  />
                )}
              </InfiniteLoader>
            )}
          </WindowScroller>
        )}
      </AutoSizer>
    </Flex>
    // </Card>
  );
}
