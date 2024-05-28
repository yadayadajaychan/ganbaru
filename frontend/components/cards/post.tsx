import { Box, Card, Flex, Separator, Text } from '@radix-ui/themes';
import {
  ThickArrowUpIcon,
  ThickArrowDownIcon,
  ChatBubbleIcon,
} from '@radix-ui/react-icons';

import './post.css';

interface Post {
  title: string;
  description: string;
  user: string;
  likes: number;
  comments: number;
  datePosted: Date;

  // user related
  isLiked?: boolean;
  isDisliked?: boolean;
}

export default function PostCard({
  title,
  description,
  user,
  likes,
  comments,
  datePosted,
}: Post) {
  return (
    <Box width='500px'>
      <Card size='2'>
        <Flex id='left' direction='column' justify='start' gap='2'>
          <Flex id='user' direction='row' justify='between'>
            <Text color='gray' size='2'>
              Posted by: {user}
            </Text>
            <Text color='gray' size='2'>
              {datePosted.toLocaleTimeString()}
            </Text>
          </Flex>
          <Flex id='content' direction='column' gap='1'>
            <Text as='label' weight='bold' size='3' truncate>
              {title}
            </Text>
            <Flex height='60px' maxHeight='60px'>
              <Text
                as='p'
                size='2'
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'pretty',
                }}
              >
                {description}
              </Text>
            </Flex>
          </Flex>
          <Separator orientation='horizontal' size='4' />
          <Flex
            id='controls'
            direction='row'
            justify='start'
            align='center'
            gap='3'
          >
            <Box
              id='likes'
              style={{
                background: 'var(--gray-a3)',
                borderRadius: 'var(--radius-3)',
              }}
              className='py-1 px-2'
            >
              <Flex gap='3' justify='start' align='center'>
                <Flex direction='row' justify='start' align='center' gap='1'>
                  <ThickArrowUpIcon className='hover:cursor-pointer icon-hover' />
                  <Text as='label' size='2'>
                    {likes}
                  </Text>
                </Flex>
                <ThickArrowDownIcon className='hover:cursor-pointer icon-hover' />
              </Flex>
            </Box>
            <Box
              id='likes'
              style={{
                background: 'var(--gray-a3)',
                borderRadius: 'var(--radius-3)',
              }}
              className='py-1 px-2 hover:cursor-pointe'
            >
              <Flex
                gap='2'
                direction='row'
                justify='start'
                align='center'
                className='hover:cursor-pointer'
              >
                <ChatBubbleIcon className='hover:cursor-pointer' />
                <Text as='label' size='2' className='hover:cursor-pointer'>
                  {comments}
                </Text>
              </Flex>
            </Box>
          </Flex>
        </Flex>
      </Card>
    </Box>
  );
}
