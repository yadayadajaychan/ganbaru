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
