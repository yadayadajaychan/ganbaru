import {
  GetClassesResponse,
  GetIsModeratorResponse,
  GetJoinCodeResponse,
  GetModJoinCodeResponse,
  Class,
} from '@/types';

export const fetchClasses = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forums`, {
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch classes');
  }

  return data as GetClassesResponse;
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

  return data as Class;
};

export const createClass = async ({
  name,
  description,
}: {
  name: string;
  description: string;
}) =>
  fetch(`${process.env.NEXT_PUBLIC_API_URL}/forums/create`, {
    //We do not know where forumID variable is.
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      description,
    }),
    credentials: 'include',
  });

export const joinClass = async ({ code }: { code: string }) =>
  fetch(`${process.env.NEXT_PUBLIC_API_URL}/forums/join/${code}`, {
    //We do not know where forumID variable is.
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
    credentials: 'include',
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
    throw new Error(data.error || 'Failed to fetch join code');
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
    throw new Error(data.error || 'Failed to fetch mod join code');
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

export const isModerator = async ({ forumId }: { forumId: string }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/forums/${forumId}/is_mod`,
    {
      credentials: 'include',
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch if moderator');
  }

  return data as GetIsModeratorResponse;
};
