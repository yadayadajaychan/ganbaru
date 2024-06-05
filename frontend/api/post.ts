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
  fetch(`/forums/${forumId}/create`, {
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
