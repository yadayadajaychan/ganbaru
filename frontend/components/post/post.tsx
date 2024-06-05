'use client';

import { fetchPost } from '@/api/post';
import { Flex } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import PostCard from '../cards/post';

interface PostProps {
  forumId: string;
  postId: string;
}

export default function Post({ forumId, postId }: PostProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['post', forumId, postId],
    queryFn: () => fetchPost({ forumId, postId }),
  });

  if (error) throw new Error(error.message);

  return (
    <Flex>
      <PostCard
        classId={forumId}
        post={
          isLoading
            ? {
                user: { uid: 25, name: 'anonymous12345' },
                title: 'test',
                full_text: `Computers have become an integral part of our daily lives, transforming the way we work, communicate, and even play. These powerful machines have revolutionized the world in ways that were once only seen in science fiction. From the early days of massive mainframe computers to the compact laptops and smartphones we use today, the evolution of the computer has been nothing short of extraordinary. One of the key innovations that has propelled the computer forward is the development of the internet. The ability to connect to a vast network of information and resources has opened up a world of possibilities for individuals and businesses alike. From online shopping to social media to remote work, the internet has reshaped our society and how we interact with one another. The speed and efficiency of modern computers have also greatly increased our productivity. Tasks that once took hours or even days to complete can now be done in a matter of minutes. This has allowed businesses to operate more efficiently and individuals to accomplish more in less time. The advent of cloud computing has further increased flexibility and accessibility, allowing users to access their files and data from anywhere in the world. But with all the benefits that computers bring, there are also potential downsides. The widespread use of computers has raised concerns about privacy and security, as cyber attacks and identity theft become more common. Additionally, the rise of automation has led to fears about job loss and economic disruption. It is important for society to address these challenges and find ways to mitigate the negative impacts of computer technology. Overall, computers have had a profound impact on our society and have revolutionized the way we live and work. They have connected us to a world of information and made tasks easier and more efficient. While there are challenges that come with this technology, the benefits far outweigh the drawbacks. As computers continue to advance, it is important that we adapt and continue to innovate in order to fully harness the potential of this powerful tool.`,
                score: 0,
                answers: 5,
                date: new Date().toISOString(),
                instructor_answered: true,
                last_activity: new Date().toISOString(),
                post_id: 25,
                views: 0,
                tags: ['test'],
                vote: 0,
              }
            : data
        }
        loading={isLoading}
      />
    </Flex>
  );
}
