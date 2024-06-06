import { Flex } from '@radix-ui/themes';
import { Class } from '@/types';
import ClassCard from '../cards/class';

export default function ClassesSkeleton() {
  const classFill: Class = {
    description: 'Software Construction',
    name: 'CS35L',
    owner: { name: 'Eggert', uid: 25 },
    forum_id: 25,
    unread: 0,
    unanswered: 0,
    important: 5,
  };

  const classes = new Array(3).fill(classFill);

  return (
    <Flex direction='column' gap='4'>
      {classes.map((classData) => (
        <ClassCard
          classData={classData}
          key={classData.forumId}
          loading={true}
        />
      ))}
    </Flex>
  );
}
