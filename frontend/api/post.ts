

export const fetchPosts = async ({ pageParam = 1, search }: { pageParam: number; search: string }) => {
    const res = await fetch(`/api/xxx/x?search=${search}page=${pageParam}`);
    return res.json();
  };