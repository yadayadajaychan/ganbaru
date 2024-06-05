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
