'use client';

import { fetchClasses } from '@/api/classes';
import { Card, Flex } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import { Class } from '@/types';

function ClassCard({ classData }: { classData: Class }) {
  return (
    <Card variant='ghost'>
      <Flex direction='row' justify='between'>
        <Flex></Flex>
      </Flex>
    </Card>
  );
}

export default function Classes() {
  const classes = useQuery({ queryKey: ['classes'], queryFn: fetchClasses });

  return <Flex></Flex>;
}
