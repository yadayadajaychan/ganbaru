import { jwtDecode } from 'jwt-decode';
import { getCookie } from 'cookies-next';

export const useSession = () => {
  const sessionIdCookie = getCookie('session_id');

  const session = jwtDecode(sessionIdCookie!) as { username: string };

  return session;
};
