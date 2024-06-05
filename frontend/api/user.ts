export const createUser = async ({
  email,
  username,
  password,
}: {
  email: string;
  username: string;
  password: string;
}) =>
  fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/create`, {
    method: 'POST',
    body: JSON.stringify({ email, username, password }),
    credentials: 'include',
  });

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) =>
  fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/login`, {
    headers: {
      'Access-Control-Allow-Credentials': 'true',
    },
    method: 'POST',
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });

export const logout = async () =>
  fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/logout`, {
    headers: {
      'Access-Control-Allow-Credentials': 'true',
    },
    method: 'POST',
    credentials: 'include',
  });
