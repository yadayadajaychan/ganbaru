

export const fetchPosts = async ({ pageParam = 0, queryKey }: { pageParam: number; queryKey: any }) => {
  const [_key, { id }] = queryKey;
  const res = await fetch(`/api/xxx/${id}?page=` + pageParam,
    {
      credentials: 'include',
    }
  );
  return res.json();
};
