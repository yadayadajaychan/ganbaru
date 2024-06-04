export const fetchPosts = async ({
  pageParam = 1,
  search,
  filter,
}: {
  pageParam: number;
  search: string;
  filter: string;
}) => {
  const res = await fetch(
    `/api/xxx/x?search=${search}&page=${pageParam}&filter=${filter}`,
    {
      credentials: 'include',
    }
  );
  return res.json();
};
