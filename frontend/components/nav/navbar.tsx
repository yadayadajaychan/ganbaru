// navbar.tsx
'use client';

import { Box, Flex, Text, HoverCard } from '@radix-ui/themes';
import Nav from './nav';
import { CaretDownIcon, PersonIcon } from '@radix-ui/react-icons';
import NextLink from 'next/link';
import { useTheme } from 'next-themes';

export default function NavBar() {
  const { theme, setTheme } = useTheme();

  return (
    <Box
      position='fixed'
      top='0'
      left='0'
      right='0'
      className='w-full transition-all border-b border-[#2b2b2b] bg-[var(--gray-1)] z-40'
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
            <HoverCard.Root>
              <HoverCard.Trigger className='hover:bg-purple-300 hover:cursor-pointer hover:bg-opacity-10 group flex select-none items-center justify-between gap-[2px] rounded-[4px] px-2 py-2'>
                <Flex>
                  <PersonIcon />
                  <CaretDownIcon
                    className='relative top-[1px] transition-transform duration-[250] ease-in group-data-[state=open]:-rotate-180'
                    aria-hidden
                  />
                </Flex>
              </HoverCard.Trigger>
              <HoverCard.Content>
                <Flex direction='column'>
                  <Text>Settings</Text>
                  <Text
                    onClick={() =>
                      setTheme(theme === 'dark' ? 'light' : 'dark')
                    }
                    className='hover:cursor-pointer'
                  >
                    Change Lighting
                  </Text>
                </Flex>
              </HoverCard.Content>
            </HoverCard.Root>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}
