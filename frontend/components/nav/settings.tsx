import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Button, Flex, Text, TextField } from '@radix-ui/themes';

export default function Settings() {
  return (
    <Flex className='w-full h-full' direction='column' gap='8'>
      <Text as='label' size='2'>
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
      </Flex>
    </Flex>
  );
}
