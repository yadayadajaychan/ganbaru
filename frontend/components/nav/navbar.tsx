import { Box, Flex, TabNav, Theme } from '@radix-ui/themes';
import Nav from './nav';

export default function NavBar() {
  return (
    <Box
      position='fixed'
      className='w-full border-b border-gray-800 backdrop-blur-xl'
    >
      <Flex
        justify='between'
        align='center'
        className='px-4 py-1'
        direction='row'
      >
        <Box id='logo'></Box>
        <Nav />
        <Box id='user'></Box>
      </Flex>
    </Box>
  );
}
