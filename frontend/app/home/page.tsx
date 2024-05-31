import PostCard from '@/components/cards/post';
import NavBar from '@/components/nav/navbar';
import { Flex } from '@radix-ui/themes';

export default function Home() {
  return (
    <>
      <Flex gap='20' direction='column'>
        <PostCard
          user='anonymous12345'
          title='When is the final project due? askjdbasid baksdkbja sdbjasd bjkaskjbdas jkbdasjkbd asbjkdabkj d sdfsdf sdfs fsf sdfdsf sdfs df sdfsdf sdf df sdfs dfsd f'
          description='testtes msdbgbjksd gkjbskgsjgjdsg bjdsgbjdfgjdjhfg djghd ghdbg dgdfjgh dsfgjhbd fgjhbds gjbdhsfg jdgf djgdf dgk dsbgidgbeigbdsgdsjfg dibgeiugbdfhgdht ksjdgkjlsfkgjn dksfgkdfgkdskgdkgdkfgjnkdf nkjgdfjkg jdgjnkdsfgkj testtes msdbgbjksd gkjbskgsjgjdsg bjdsgbjdfgjdjhfg djghd ghdbg dgdfjgh dsfgjhbd fgjhbds gjbdhsfg jdgf djgdf dgk dsbgidgbeigbdsgdsjfg dibgeiugbdfhgdht ksjdgkjlsfkgjn dksfgkdfgkdskgdkgdkfgjnkdf nkjgdfjkg jdgjnkdsfgkj testtes msdbgbjksd gkjbskgsjgjdsg bjdsgbjdfgjdjhfg djghd ghdbg dgdfjgh dsfgjhbd fgjhbds gjbdhsfg jdgf djgdf dgk dsbgidgbeigbdsgdsjfg dibgeiugbdfhgdht ksjdgkjlsfkgjn dksfgkdfgkdskgdkgdkfgjnkdf nkjgdfjkg jdgjnkdsfgkj'
          likes={10}
          comments={10}
          datePosted={new Date()}
          preview={true}
        />
      </Flex>
    </>
  );
}
