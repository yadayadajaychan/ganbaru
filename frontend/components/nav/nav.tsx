'use client';

import { CaretDownIcon } from '@radix-ui/react-icons';
import { Text, Flex, HoverCard } from '@radix-ui/themes';
import NextLink from 'next/link';
import Classes from '@/components/class/classes';

export default function Nav({ classId }: { classId: string }) {
  return (
    <Flex className='flex flex-row justify-between items-center p-4'>
      <Flex className='flex flex-row gap-2'>
        <NextLink
          href={`/forum/${classId}`}
          className='group flex select-none items-center justify-between gap-[2px] rounded-[4px] px-3 py-2'
        >
          <Text size='2'>Home</Text>
        </NextLink>
        <HoverCard.Root>
          <HoverCard.Trigger className='hover:bg-purple-300 hover:cursor-pointer hover:bg-opacity-10 group flex select-none items-center justify-between gap-[2px] rounded-[4px] px-2 py-2'>
            <Flex>
              <Text size='2'>Classes</Text>
              <CaretDownIcon
                className='relative top-[1px] transition-transform duration-[250] ease-in group-data-[state=open]:-rotate-180'
                aria-hidden
              />
            </Flex>
          </HoverCard.Trigger>
          <HoverCard.Content width='200px'>
            <Classes />
          </HoverCard.Content>
        </HoverCard.Root>
      </Flex>
    </Flex>
  );
}
