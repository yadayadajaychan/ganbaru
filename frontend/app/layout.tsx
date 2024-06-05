// layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import ReactQueryProvider from '@/providers/reactQuery';
import { Theme } from '@radix-ui/themes';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Ganbaru',
  description: 'A forum for sharing and discussing ideas',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='min-h-screen'>
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          value={{ light: 'light', dark: 'dark' }}
        >
          <Theme accentColor='purple'>
            <Toaster
              position='bottom-right'
              toastOptions={{
                style: {
                  backgroundColor: 'var(--color-panel-solid)',
                  color: 'var(--gray-11)',
                  outline: '1px solid var(--gray-5)',
                  padding: '10px',
                  zIndex: 9999,
                  fontSize: '14px',
                },
              }}
            />
            {/* <NavBar /> */}
            <ReactQueryProvider>{children}</ReactQueryProvider>
          </Theme>
        </ThemeProvider>
      </body>
    </html>
  );
}
