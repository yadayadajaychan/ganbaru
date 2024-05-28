'use client';

import { Box, Flex, TabNav } from '@radix-ui/themes';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import Nav from './nav';

export default function NavBar() {
  return (
    <Flex
      justify='between'
      align='center'
      className='px-4 py-4'
      direction='row'
    >
      <Box id='logo'></Box>
      <Nav />
      <Box id='user'></Box>
    </Flex>
  );
}
