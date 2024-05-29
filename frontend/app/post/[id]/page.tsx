import { useEffect, useState } from 'react';
import { GetCommentsResponse, Post } from '@/types';
import { useInfiniteQuery, QueryFunction } from '@tanstack/react-query';

export default function Post({ params }: { params: { id: string } }) {
  const fetchComments = async ({ pageParam = 0 }) => {
    const res = await fetch(`/api/xxx/${params.id}?page=` + pageParam);
    return res.json();
  };

  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['comments'],
    queryFn: fetchComments,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });

  return <></>;
}
