'use client';

import { fetchClasses } from '@/api/classes';
import { Button, Card, Flex, Separator, Text } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import { Class } from '@/types';
import Link from 'next/link';

function ClassCard({ classData }: { classData: Class }) {
  return (
    <Card variant='ghost'>
      <Flex direction='row' justify='between'>
        <Flex direction='column' gap='1'>
          <Text size='2' weight='bold'>
            {classData.name}
          </Text>
          <Text size='1'>{classData.description}</Text>
        </Flex>
        <Flex justify='end' align='center'>
          <Link href={`/forum/${classData.forum_id}`}>
            <Button variant='outline' className='hover:cursor-pointer'>
              Go
            </Button>
          </Link>
        </Flex>
      </Flex>
    </Card>
  );
}

export default function Classes() {
  const classes = useQuery({ queryKey: ['classes'], queryFn: fetchClasses });

  return (
    <Flex direction='column' gap='2'>
      <ClassCard
        classData={{
          description: 'test',
          name: 'test',
          owner: { name: 'test', uid: 25 },
          forum_id: 25,
          unread: 0,
          unanswered: 0,
          important: 5,
        }}
      />
      <Separator orientation='horizontal' size='4' />
      <ClassCard
        classData={{
          description: 'test',
          name: 'test',
          owner: { name: 'test', uid: 25 },
          forum_id: 25,
          unread: 0,
          unanswered: 0,
          important: 5,
        }}
      />
    </Flex>
  );
}
