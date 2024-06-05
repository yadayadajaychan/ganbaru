'use client';

import { fetchClasses } from '@/api/classes';
import { Button, Card, Flex, Separator, Text } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import { Class } from '@/types';
import Link from 'next/link';
import JoinClass from '@/components/class/join';
import ClassCard from '@/components/cards/class';
import ClassesSkeleton from './skeleton';
import CreateClass from './create';

export default function Classes() {
  const { data, isLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: fetchClasses,
  });

  return (
    <Flex direction='column' gap='4' className='w-full'>
      <Flex direction='column' gap='4'>
        {isLoading ?? <ClassesSkeleton />}
        {data && data.forums.length > 0 ? (
          data.forums.map((classData: Class) => (
            <ClassCard
              classData={classData}
              key={classData.forum_id}
              loading={false}
            />
          ))
        ) : (
          <Flex justify='center' align='center'>
            <Text>No classes found</Text>
          </Flex>
        )}
      </Flex>
      <Flex
        justify='center'
        direction='column'
        gap='2'
        align='center'
        className='w-full'
      >
        <CreateClass />
        <JoinClass title='Join a Class' />
      </Flex>
    </Flex>
  );
}
