import { useEffect, useState } from 'react';
import { GetCommentsResponse } from '@/types';
import { Button, Flex, Popover } from '@radix-ui/themes';
import CommentCreate from '@/components/create';

import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { fetchComments } from '@/api/comment';
import CommentContainer from '@/components/comment/container';
import { ChatBubbleIcon } from '@radix-ui/react-icons';
import { AutoSizer } from 'react-virtualized';
import CommentPopover from '@/components/comment/create';
import PostCard from '@/components/cards/post';

export default async function Post({
  params,
}: {
  params: { postId: string; forumId: string };
}) {
  return (
    <Flex
      justify='center'
      align='center'
      className='min-h-screen'
      direction='column'
      gap='9'
    >
      <Flex
        justify='start'
        direction='column'
        gap='4'
        className='w-full px-4 md:max-w-3xl'
      >
        <PostCard
          post={{
            user: { uid: 25, name: 'anonymous12345' },
            title: 'test',
            full_text: `Computers have become an integral part of our daily lives, transforming the way we work, communicate, and even play. These powerful machines have revolutionized the world in ways that were once only seen in science fiction. From the early days of massive mainframe computers to the compact laptops and smartphones we use today, the evolution of the computer has been nothing short of extraordinary. One of the key innovations that has propelled the computer forward is the development of the internet. The ability to connect to a vast network of information and resources has opened up a world of possibilities for individuals and businesses alike. From online shopping to social media to remote work, the internet has reshaped our society and how we interact with one another. The speed and efficiency of modern computers have also greatly increased our productivity. Tasks that once took hours or even days to complete can now be done in a matter of minutes. This has allowed businesses to operate more efficiently and individuals to accomplish more in less time. The advent of cloud computing has further increased flexibility and accessibility, allowing users to access their files and data from anywhere in the world. But with all the benefits that computers bring, there are also potential downsides. The widespread use of computers has raised concerns about privacy and security, as cyber attacks and identity theft become more common. Additionally, the rise of automation has led to fears about job loss and economic disruption. It is important for society to address these challenges and find ways to mitigate the negative impacts of computer technology. Overall, computers have had a profound impact on our society and have revolutionized the way we live and work. They have connected us to a world of information and made tasks easier and more efficient. While there are challenges that come with this technology, the benefits far outweigh the drawbacks. As computers continue to advance, it is important that we adapt and continue to innovate in order to fully harness the potential of this powerful tool. ![image](https://scontent-lax3-1.xx.fbcdn.net/v/t45.5328-4/426735721_3293211997488904_7292296827104316541_n.jpg?stp=dst-jpg_s960x960&_nc_cat=105&ccb=1-7&_nc_sid=247b10&_nc_ohc=sdIZkBmwPfYQ7kNvgENxKmL&_nc_ht=scontent-lax3-1.xx&oh=00_AYBx1LXB2ZCoU2RTBY8HZfKwxftTy0UMavZhLF76N8_USg&oe=6660CB93)`,
            score: 0,
            answers: 5,
            date: new Date().toISOString(),
            instructor_answered: true,
            last_activity: new Date().toISOString(),
            post_id: 25,
            views: 0,
            tags: ['test'],
            vote: 0,
          }}
          preview={false}
        />
        <CommentPopover forumId={params.forumId} postId={params.postId} />
        <CommentContainer forumId={params.forumId} postId={params.postId} />
      </Flex>
    </Flex>
  );
}
