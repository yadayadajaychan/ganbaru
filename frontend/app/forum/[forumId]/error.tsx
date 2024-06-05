'use client'; // Error components must be Client Components

import { Button, Flex, Heading } from '@radix-ui/themes';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <Flex
      className='w-full'
      justify='center'
      align='center'
      direction='column'
      gap='4'
    >
      <Heading>{error.message}</Heading>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </Flex>
  );
}
