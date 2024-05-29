'use client';

import { Comment as CommentType, Post } from '@/types';
import { Card } from '@radix-ui/themes';
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
} from '@tanstack/react-query';

interface CommentContainerProps {
  comments: CommentType[];
  loadMoreComments: () => Promise<
    InfiniteQueryObserverResult<InfiniteData<any, unknown>, Error>
  >;
}

export default function CommentContainer({
  comments,
  loadMoreComments,
}: CommentContainerProps) {
  // will be the virtualized list that contains all of the comments
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);

  const isRowLoaded = ({ index }: { index: number }) => {
    return !!comments[index];
  };

  const handlePageLoad = async () => {
    setIsNextPageLoading(true);
    await loadMoreComments();
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
                    rowHeight={42}
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
    </Card>
  );
}
