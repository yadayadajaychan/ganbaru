'use client';

import { Card, Flex, Separator } from '@radix-ui/themes';
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

const cache = new CellMeasurerCache({
  fixedWidth: true,
  defaultHeight: 100,
});

// will be the virtualized list that contains all of the posts
export default function PostContainer() {
  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });

  const allRecords = data ? data.pages.map((page) => page.records) : [];
  const posts = allRecords.flat();

  const [isNextPageLoading, setIsNextPageLoading] = useState(false);

  const isRowLoaded = ({ index }: { index: number }) => {
    return !!posts[index];
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
          <PostCard post={posts[index]} preview={true} />
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
                    rowCount={posts.length}
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
