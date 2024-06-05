import { Class } from '@/types';
import { Card, Flex, Button, Text, Badge, Skeleton } from '@radix-ui/themes';
import Link from 'next/link';

interface ClassCardProps {
  classData: Class;
  loading?: boolean;
}

export default function ClassCard({
  classData,
  loading = false,
}: ClassCardProps) {
  return (
    <Card variant='ghost'>
      <Flex direction='row' justify='between'>
        <Flex direction='column' gap='1'>
          <Flex justify='between' gap='1'>
            <Text size='2' weight='bold'>
              <Skeleton loading={loading}>{classData.name}</Skeleton>
            </Text>
            {/* <Flex direction='row' gap='1'>
              <Badge color='yellow'>{classData.unanswered}</Badge>
            </Flex> */}
          </Flex>
          <Text size='1'>
            {' '}
            <Skeleton loading={loading}>{classData.description}</Skeleton>
          </Text>
        </Flex>
        <Flex justify='end' align='center'>
          <Skeleton loading={loading}>
            <Link href={`/forum/${classData.forum_id}`}>
              <Button variant='outline' className='hover:cursor-pointer'>
                Go
              </Button>
            </Link>
          </Skeleton>
        </Flex>
      </Flex>
    </Card>
  );
}
