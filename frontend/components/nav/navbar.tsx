// navbar.tsx
'use client';

import {
  Box,
  Flex,
  Text,
  HoverCard,
  ContextMenu,
  DropdownMenu,
  Dialog,
  Badge,
} from '@radix-ui/themes';
import Nav from './nav';
import { CaretDownIcon, PersonIcon } from '@radix-ui/react-icons';
import NextLink from 'next/link';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import Settings from './settings';
import { useRouter } from 'next/navigation';
import Code from './code';
import { useQuery } from '@tanstack/react-query';
import { isModerator } from '@/api/classes';
import { useCookies } from 'next-client-cookies';
import { jwtDecode } from 'jwt-decode';
import { useSession } from '@/util/session';

export default function NavBar({ classId }: { classId: string }) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);

  const { isLoading: isModeratorLoading, error: moderatorError } = useQuery({
    queryKey: ['isModerator', classId],
    queryFn: () => isModerator({ forumId: classId }),
  });

  const logout = async () => {
    await fetch('/api/logout', {
      method: 'POST',
    });

    router.push('/');
  };

  const session = useSession();

  return (
    <Box
      position='fixed'
      top='0'
      left='0'
      right='0'
      className='w-full transition-all border-b border-[var(--gray-5)] bg-[var(--gray-1)] z-40'
    >
      <Flex
        justify='between'
        align='center'
        className='px-4 py-2'
        direction='row'
        height='50px'
      >
        <Box id='logo'></Box>

        <Box
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <Nav classId={classId} />
        </Box>

        <Box id='user'>
          <Flex className='flex flex-row gap-2 ml-auto'>
            <Flex justify='center' align='center' direction='row' gap='2'>
              <Text size='2' className='hidden md:inline '>
                {session['username']}
              </Text>
              {!!!moderatorError && <Badge color='green'>Moderator</Badge>}
            </Flex>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger className='hover:bg-purple-300 hover:cursor-pointer hover:bg-opacity-10 group flex select-none items-center justify-between gap-[2px] rounded-[4px] px-2 py-2'>
                <Flex>
                  <PersonIcon />
                  <CaretDownIcon
                    className='relative top-[1px] transition-transform duration-[250] ease-in group-data-[state=open]:-rotate-180'
                    aria-hidden
                  />
                </Flex>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content size='1'>
                <DropdownMenu.Item
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className='hover:cursor-pointer'
                >
                  Change Lighting
                </DropdownMenu.Item>
                {!!!moderatorError && (
                  <DropdownMenu.Item
                    className='hover:cursor-pointer'
                    onClick={() => setCodeOpen(true)}
                  >
                    Manage Join Codes
                  </DropdownMenu.Item>
                )}
                <DropdownMenu.Item
                  className='hover:cursor-pointer'
                  onClick={() => setSettingsOpen(true)}
                >
                  Settings
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  className='hover:cursor-pointer'
                  onClick={() => logout()}
                >
                  Logout
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Flex>
          <Dialog.Root open={settingsOpen} onOpenChange={setSettingsOpen}>
            <Dialog.Content>
              <Flex direction='column' gap='6'>
                <Flex direction='column'>
                  <Dialog.Title>Settings</Dialog.Title>
                  <Dialog.Description>Change User Settings</Dialog.Description>
                </Flex>
                <Settings />
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
          <Dialog.Root open={codeOpen} onOpenChange={setCodeOpen}>
            <Dialog.Content>
              <Flex direction='column' gap='2'>
                <Flex direction='column'>
                  <Dialog.Title>Manage Join Code</Dialog.Title>
                </Flex>
                <Code classId={classId} />
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        </Box>
      </Flex>
    </Box>
  );
}
