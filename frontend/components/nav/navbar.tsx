// navbar.tsx
'use client';

import {
  Box,
  Flex,
  Text,
  HoverCard,
  ContextMenu,
  DropdownMenu,
} from '@radix-ui/themes';
import Nav from './nav';
import { CaretDownIcon, PersonIcon } from '@radix-ui/react-icons';
import NextLink from 'next/link';
import { useTheme } from 'next-themes';
import { useState } from 'react';

export default function NavBar() {
  const { theme, setTheme } = useTheme();

  const [settingsOpen, setSettingsOpen] = useState(false);

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
          <Nav />
        </Box>

        <Box id='user'>
          <Flex className='flex flex-row gap-2 ml-auto'>
            <NextLink
              href='/'
              className='group flex select-none items-center justify-between gap-[2px] rounded-[4px] px-3 py-2'
            >
              <Text size='2'>Ben Chen</Text>
            </NextLink>
            <DropdownMenu.Root
              open={settingsOpen}
              onOpenChange={setSettingsOpen}
            >
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
                <DropdownMenu.Item className='hover:cursor-pointer'>
                  Settings
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}
