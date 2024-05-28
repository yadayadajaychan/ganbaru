import { Box, Flex, TabNav, Theme } from '@radix-ui/themes';
import Nav from './nav';

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
        <Box id='user'></Box>
      </Flex>
    </Box>
  );
}
