import { GetJoinCodeResponse, GetModJoinCodeResponse } from '@/types';

export const fetchClasses = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forums`, {
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch classes');
  }

  return data;
};

export const fetchClass = async ({ forumId }: { forumId: string }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/forums/${forumId}`,
    {
      credentials: 'include',
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch classes');
  }

  return data;
};

export const joinClass = async ({ code }: { code: string }) =>
  fetch(`${process.env.NEXT_PUBLIC_API_URL}/forums/join/${code}`, {
    //We do not know where forumID variable is.
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });

export const fetchJoinCode = async ({ forumId }: { forumId: string }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/forums/${forumId}/join_code`,
    {
      credentials: 'include',
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch classes');
  }

  return data as GetJoinCodeResponse;
};

export const fetchModJoinCode = async ({ forumId }: { forumId: string }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/forums/${forumId}/mod_join_code`,
    {
      credentials: 'include',
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch classes');
  }

  return data as GetModJoinCodeResponse;
};

export const refreshJoinCode = async ({ forumId }: { forumId: string }) =>
  fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/forums/${forumId}/refresh_join_code`,
    {
      //We do not know where forumID variable is.
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    }
  );

export const refreshModJoinCode = async ({ forumId }: { forumId: string }) =>
  fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/forums/${forumId}/refresh_mod_join_code`,
    {
      //We do not know where forumID variable is.
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    }
  );
