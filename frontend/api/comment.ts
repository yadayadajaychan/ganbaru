export const fetchComments = async ({
  pageParam = 0,
  classId,
  postId,
}: {
  pageParam: number;
  classId: number;
  postId: number;
}) => {
  const res = await fetch(
    `/forums/${classId}/${postId}/answers?page=${pageParam}`,
    {
      credentials: 'include',
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch comments');
  }

  return data;
};

export const createComment = async ({
  classId,
  postId,
  content,
  anonymous,
}: {
  classId: number;
  postId: number;
  content: string;
  anonymous: boolean;
}) =>
  fetch(`/forums/${classId}/${postId}/create`, {
    method: 'POST',
    body: JSON.stringify({ answer: content, anonymous }),
    credentials: 'include',
  });

export const voteComment = async ({
  classId,
  postId,
  commentId,
  vote,
}: {
  classId: number;
  postId: number;
  commentId: number;
  vote: number;
}) =>
  fetch(`/forums/${classId}/postId/${commentId}/vote`, {
    method: 'POST',
    body: JSON.stringify({ vote }),
    credentials: 'include',
  });
