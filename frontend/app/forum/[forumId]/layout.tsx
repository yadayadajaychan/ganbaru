import NavBar from '@/components/nav/navbar';
import { QueryClient, useQuery } from '@tanstack/react-query';

export default function ForumLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    forumId: string;
  };
}) {
  return (
    <>
      <NavBar classId={params.forumId} />
      <main className='pt-[66px] px-4'>{children}</main>
    </>
  );
}
