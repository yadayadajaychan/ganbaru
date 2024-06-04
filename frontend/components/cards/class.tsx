import { Class } from '@/types';
import { Card, Flex, Button, Text, Badge } from '@radix-ui/themes';
import Link from 'next/link';

interface ClassCardProps {
  classData: Class;
  preview?: boolean;
}

export default function ClassCard({
  classData,
  preview = false,
}: ClassCardProps) {
  return (
    <Card variant='ghost'>
      <Flex direction='row' justify='between'>
        <Flex direction='column' gap='1'>
          <Flex justify='between' gap='1'>
            <Text size='2' weight='bold'>
              {classData.name}
            </Text>
            {/* <Flex direction='row' gap='1'>
              <Badge color='yellow'>{classData.unanswered}</Badge>
            </Flex> */}
          </Flex>
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
