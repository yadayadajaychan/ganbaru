'use client';

import { CaretDownIcon } from '@radix-ui/react-icons';
import { Text, Flex, HoverCard, Popover } from '@radix-ui/themes';
import NextLink from 'next/link';
import Classes from '@/components/class/classes';
import { fetchClass } from '@/api/classes';
import { useQuery } from '@tanstack/react-query';

export default function Nav({ classId }: { classId: string }) {
  const { data, error, isLoading } = useQuery({
    queryKey: ['forum', classId],
    queryFn: () => fetchClass({ forumId: classId }),
  });

  return (
    <Flex className='flex flex-row justify-between items-center p-4'>
      <Flex className='flex flex-row gap-2'>
        <NextLink
          href={`/forum/${classId}`}
          className='group flex select-none items-center justify-between gap-[2px] rounded-[4px] px-3 py-2'
        >
          <Text size='2'>{data ? data.name : 'Home'}</Text>
        </NextLink>
        <Popover.Root>
          <Popover.Trigger className='hover:bg-purple-300 hover:cursor-pointer hover:bg-opacity-10 group flex select-none items-center justify-between gap-[2px] rounded-[4px] px-2 py-2'>
            <Flex>
              <Text size='2'>Classes</Text>
              <CaretDownIcon
                className='relative top-[1px] transition-transform duration-[250] ease-in group-data-[state=open]:-rotate-180'
                aria-hidden
              />
            </Flex>
          </Popover.Trigger>
          <Popover.Content width='200px'>
            <Classes />
          </Popover.Content>
        </Popover.Root>
      </Flex>
    </Flex>
  );
}
