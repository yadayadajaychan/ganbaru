'use client';

import { Box, Flex, Text, HoverCard } from '@radix-ui/themes';
import Nav from './nav';
import { CaretDownIcon, PersonIcon } from '@radix-ui/react-icons';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import NextLink from 'next/link';

export default function NavBar() {
  return (
    <Box
      position='fixed'
      top='0'
      left='0'
      right='0'
      className='w-full transition-all border-b border-[#2b2b2b] backdrop-blur-xl'
    >
      <Flex
        justify='between'
        align='center'
        className='px-4 py-2'
        direction='row'
        height='50px'
      >
        <Box id='logo'></Box>
        <Nav />

        <Box id='user'>
          {/* <NavigationMenu.Root>
            <NavigationMenu.List>
              <NavigationMenu.Item>
                <NavigationMenu.Trigger className='hover:cursor-pointer flex items-center'>
                  <Avatar className='w-8 h-8'>
                    <AvatarImage src='/path/to/profile-pic.jpg' alt='Profile Picture' />
                    <AvatarFallback>BC</AvatarFallback>
                  </Avatar>
                  <Text size='2' className='ml-2'>Name</Text>
                  <CaretDownIcon
                    className='ml-1 relative top-[1px] transition-transform duration-[250] ease-in'
                    aria-hidden
                  />
                </NavigationMenu.Trigger>
                <NavigationMenu.Content>
                  <Flex className='flex-col gap-2 p-2'>
                    <NavigationMenu.Link href='/profile'>
                      <Text>Profile</Text>
                    </NavigationMenu.Link>
                    <NavigationMenu.Link href='/settings'>
                      <Text>Settings</Text>
                    </NavigationMenu.Link>
                    <NavigationMenu.Link href='/logout'>
                      <Text>Logout</Text>
                    </NavigationMenu.Link>
                  </Flex>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
            </NavigationMenu.List>

            <NavigationMenu.Indicator />
          </NavigationMenu.Root> 
          */}

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
                <Flex direction="column">
                  <Text>Settings</Text>
                  <Text>Change Lighting</Text>
                </Flex>
              </HoverCard.Content>
            </HoverCard.Root>
          </Flex>







        </Box>

      </Flex>
    </Box>
  );
}
