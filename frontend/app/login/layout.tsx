export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // TODO: check if user is already logged in

  return <>{children}</>;
}
