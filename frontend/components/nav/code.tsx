'use client';

import {
  fetchJoinCode,
  fetchModJoinCode,
  refreshJoinCode,
  refreshModJoinCode,
} from '@/api/classes';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import {
  Button,
  DataList,
  Flex,
  Skeleton,
  Spinner,
  Text,
  TextField,
} from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function Code({ classId }: { classId: string }) {
  const [isRefreshingJoinCode, setIsRefreshingJoinCode] = useState(false);
  const [isRefreshingModJoinCode, setIsRefreshingModJoinCode] = useState(false);

  const { data: joinCode, refetch: refetchJoinCode } = useQuery({
    queryKey: ['joinCode'],
    queryFn: () => fetchJoinCode({ forumId: classId }),
  });

  const { data: modJoinCode, refetch: refectchModJoinCode } = useQuery({
    queryKey: ['moderatorJoinCode'],
    queryFn: () => fetchModJoinCode({ forumId: classId }),
  });

  const onRefreshJoinCode = async () => {
    console.log('here');

    setIsRefreshingJoinCode(true);

    const res = await refreshJoinCode({ forumId: classId });
    if (!res.ok) {
      setIsRefreshingJoinCode(false);
      toast.error('Failed to refresh join code');
      return;
    }

    await refetchJoinCode();
    setIsRefreshingJoinCode(false);
  };
  const onRefreshModJoinCode = async () => {
    setIsRefreshingModJoinCode(true);

    const res = await refreshModJoinCode({ forumId: classId });
    if (!res.ok) {
      setIsRefreshingModJoinCode(false);
      toast.error('Failed to refresh moderator join code');
      return;
    }

    await refectchModJoinCode();
    setIsRefreshingModJoinCode(false);
  };

  return (
    <Flex className='w-full h-full' direction='column' gap='8'>
      <DataList.Root>
        <DataList.Item align='center'>
          <DataList.Label minWidth='88px'>Join Code</DataList.Label>
          <DataList.Value>
            {joinCode ? joinCode.join_code : <Skeleton>NO CODE</Skeleton>}
          </DataList.Value>
        </DataList.Item>
        <DataList.Item align='center'>
          <DataList.Label minWidth='88px'>Moderator Join Code</DataList.Label>
          <DataList.Value>
            {modJoinCode ? (
              modJoinCode.mod_join_code
            ) : (
              <Skeleton>NO CODE</Skeleton>
            )}
          </DataList.Value>
        </DataList.Item>
      </DataList.Root>
      <Flex justify='end' direction='row' gap='4'>
        <Button
          className='hover:cursor-pointer'
          size='2'
          variant='soft'
          onClick={onRefreshJoinCode}
        >
          {isRefreshingJoinCode ? <Spinner /> : 'Refresh Join Code'}
        </Button>
        <Button
          className='hover:cursor-pointer'
          size='2'
          variant='soft'
          onClick={onRefreshModJoinCode}
        >
          {isRefreshingModJoinCode ? (
            <Spinner />
          ) : (
            'Refresh Moderator Join Code'
          )}
        </Button>
      </Flex>
      {/* <Text as='label' size='2'>
        Username
        <TextField.Root
          mt='1'
          placeholder='Username'
          size='2'
          className='w-full'
        />
      </Text>
      <Flex justify='end'>
        <Button className='hover:cursor-pointer' size='2' variant='soft'>
          Save Settings
        </Button>
      </Flex> */}
    </Flex>
  );
}
