

export const fetchComments = async ({ pageParam = 0, postId }: { pageParam: number; postId: number }) => {
    const res = await fetch(`/api/xxx/${postId}?page=` + pageParam);
    return res.json();
  };