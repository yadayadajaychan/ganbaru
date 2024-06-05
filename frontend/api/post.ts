import { GetPostsResponse } from '@/types';

export const fetchPosts = async ({
  pageParam = 1,
  search,
  filter,
  forumId,
}: {
  pageParam: number;
  forumId: number;
  search: string;
  filter: string;
}) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/forums/${forumId}?search=${search}&page=${pageParam}&filter=${filter}`,
    {
      credentials: 'include',
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch posts');
  }

  return data as GetPostsResponse;
};

export const fetchPost = async ({
  forumId,
  postId,
}: {
  forumId: string;
  postId: string;
}) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/forums/${forumId}/${postId}`,
    {
      credentials: 'include',
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch post');
  }

  return data;
};

export const createPost = async ({
  forumId,
  title,
  fullText,
  tags,
  anonymous,
}: {
  forumId: string;
  title: string;
  fullText: string;
  tags: string[];
  anonymous: boolean;
}) =>
  fetch(`${process.env.NEXT_PUBLIC_API_URL}/forums/${forumId}/create`, {
    //We do not know where forumID variable is.
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      full_text: fullText,
      tags,
      anonymous,
    }),
  });
