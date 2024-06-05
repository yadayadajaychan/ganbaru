import NavBar from '@/components/nav/navbar';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function ForumLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    forumId: string;
  };
}) {
  const cookie = cookies();
  if (!cookie.get('session_id')) {
    return redirect('/login');
  }

  return (
    <>
      <NavBar classId={params.forumId} />
      <main className='pt-[66px] px-4'>{children}</main>
    </>
  );
}
