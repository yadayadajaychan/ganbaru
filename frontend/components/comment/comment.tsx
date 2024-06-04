import type { Comment } from '@/types';
import { Flex, Separator, Text } from '@radix-ui/themes';

import { ThickArrowUpIcon, ThickArrowDownIcon } from '@radix-ui/react-icons';
import { MarkdownToJsx } from '../markdown';

// the comment itself that is displaye on a post
export default function Comment({ comment }: { comment: Comment }) {
  return (
    <Flex direction='column' gap='4'>
      <Flex id='user' direction='row' gap='4' justify='start' align='center'>
        <Text size='2' weight='bold'>
          {comment.user.name}
        </Text>
        <Separator orientation='vertical' size='1' />
        <Text size='1'>{new Date(comment.date).toLocaleTimeString()}</Text>
      </Flex>
      <Flex
        direction='column'
        gap='2'
        className='border-l-2 border-[var(--gray-5)] pl-4'
      >
        <MarkdownToJsx markdown={comment.answer} />
      </Flex>
      <Flex gap='3' justify='start' align='center'>
        <Flex direction='row' justify='start' align='center' gap='1'>
          <ThickArrowUpIcon className={`hover:cursor-pointer icon-hover`} />
          <Text as='label' size='2'>
            {comment.score}
          </Text>
        </Flex>
        <ThickArrowDownIcon className={`hover:cursor-pointer icon-hover`} />
      </Flex>
    </Flex>
  );
}
