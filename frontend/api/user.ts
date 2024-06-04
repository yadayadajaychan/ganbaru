export const creaetUser = async ({
  email,
  username,
  password,
}: {
  email: string;
  username: string;
  password: string;
}) =>
  fetch('/user/create', {
    method: 'POST',
    body: JSON.stringify({ email, username, password }),
  });

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) =>
  fetch('/user/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
