import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookie = cookies();
  if (cookie.get('session_id')) {
    return redirect('/');
  }

  return <>{children}</>;
}
