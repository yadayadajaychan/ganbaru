import NavBar from '@/components/nav/navbar';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar />
      <main className='pt-[66px] px-4'>{children}</main>
    </>
  );
}
