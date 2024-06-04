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
    `/forums/${classId}/${postId}/answers?page=` + pageParam
  );
  return res.json();
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
  });
