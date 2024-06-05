'use client';

import { fetchClasses } from '@/api/classes';
import { Button, Card, Flex, Separator, Text } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import { Class } from '@/types';
import Link from 'next/link';
import JoinClass from '@/components/class/join';
import ClassCard from '@/components/cards/class';

export default function Classes() {
  const classes = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const classes = await fetchClasses();
      return classes.json();
    },
  });

  return (
    <Flex direction='column' gap='4' className='w-full'>
      <Flex direction='column' gap='4'>
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
      <Flex justify='center' align='end' className='w-full'>
        <JoinClass />
      </Flex>
    </Flex>
  );
}
