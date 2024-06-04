import PostCard from '@/components/cards/post';
import Create from '@/components/create';
import NavBar from '@/components/nav/navbar';
import PostContainer from '@/components/post/container';
import PostCreate from '@/components/post/create';
import { PlusIcon } from '@radix-ui/react-icons';
import { Dialog, Flex, IconButton } from '@radix-ui/themes';

export default function Home() {
  return (
    <>
      <Flex gap='20' direction='column' justify='start' align='center'>
        {/* <PostCard
          user='anonymous12345'
          title='When is the final project due? askjdbasid baksdkbja sdbjasd bjkaskjbdas jkbdasjkbd asbjkdabkj d sdfsdf sdfs fsf sdfdsf sdfs df sdfsdf sdf df sdfs dfsd f'
          description='testtes msdbgbjksd gkjbskgsjgjdsg bjdsgbjdfgjdjhfg djghd ghdbg dgdfjgh dsfgjhbd fgjhbds gjbdhsfg jdgf djgdf dgk dsbgidgbeigbdsgdsjfg dibgeiugbdfhgdht ksjdgkjlsfkgjn dksfgkdfgkdskgdkgdkfgjnkdf nkjgdfjkg jdgjnkdsfgkj testtes msdbgbjksd gkjbskgsjgjdsg bjdsgbjdfgjdjhfg djghd ghdbg dgdfjgh dsfgjhbd fgjhbds gjbdhsfg jdgf djgdf dgk dsbgidgbeigbdsgdsjfg dibgeiugbdfhgdht ksjdgkjlsfkgjn dksfgkdfgkdskgdkgdkfgjnkdf nkjgdfjkg jdgjnkdsfgkj testtes msdbgbjksd gkjbskgsjgjdsg bjdsgbjdfgjdjhfg djghd ghdbg dgdfjgh dsfgjhbd fgjhbds gjbdhsfg jdgf djgdf dgk dsbgidgbeigbdsgdsjfg dibgeiugbdfhgdht ksjdgkjlsfkgjn dksfgkdfgkdskgdkgdkfgjnkdf nkjgdfjkg jdgjnkdsfgkj'
          likes={10}
          comments={10}
          datePosted={new Date()}
          preview={true}
        /> */}
        <PostContainer />
        {/* bottom right */}
        <Flex
          position='fixed'
          gap='20'
          direction='column'
          bottom='50px'
          right='50px'
        >
          <PostCreate />
        </Flex>
      </Flex>
    </>
  );
}
