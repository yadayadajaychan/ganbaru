import { jwtDecode } from 'jwt-decode';
import { useCookies } from 'next-client-cookies';

export const useSession = () => {
  const cookies = useCookies();
  const sessionIdCookie = cookies.get('session_id');

  const session = jwtDecode(sessionIdCookie!) as { username: string };

  return session;
};
