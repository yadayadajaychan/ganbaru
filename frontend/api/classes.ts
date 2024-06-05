export const fetchClasses = async () => {
  const res = await fetch(`/forums`, {
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch post');
  }

  return data;
};
