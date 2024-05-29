'use client';

import {
  FontItalicIcon,
  FontBoldIcon,
  StrikethroughIcon,
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  MagicWandIcon,
  ImageIcon,
  CrumpledPaperIcon,
} from '@radix-ui/react-icons';
import {
  Box,
  Card,
  Flex,
  Heading,
  IconButton,
  TextArea,
  Text,
  Button,
} from '@radix-ui/themes';
import { Label } from '@radix-ui/react-label';

interface CommentCreateProps {
  postId: string;
}

export default function CommentCreate({ postId }: CommentCreateProps) {
  return (
    <Card size='2'>
      <Heading as='h3' size='3' mb='4'>
        Add a Comment
      </Heading>
      <Flex direction='column' gap='4'>
        <Box width='416px'>
          <Card>
            <Flex direction='column' gap='2'>
              <Box>
                <Flex gap='4'>
                  <Flex gap='1'>
                    <IconButton variant='soft' highContrast>
                      <FontItalicIcon />
                    </IconButton>

                    <IconButton variant='soft' highContrast>
                      <FontBoldIcon />
                    </IconButton>

                    <IconButton variant='soft' highContrast>
                      <StrikethroughIcon />
                    </IconButton>
                  </Flex>

                  <Flex gap='1'>
                    <IconButton variant='soft' highContrast>
                      <TextAlignLeftIcon />
                    </IconButton>

                    <IconButton variant='soft' highContrast>
                      <TextAlignCenterIcon />
                    </IconButton>

                    <IconButton variant='soft' highContrast>
                      <TextAlignRightIcon />
                    </IconButton>
                  </Flex>
                </Flex>
              </Box>
              <TextArea
                spellCheck={false}
                variant='classic'
                rows={10}
                placeholder='Start typing here...'
                style={{ border: 0, outline: 0 }}
              />
            </Flex>
          </Card>
        </Box>
        <Button variant='soft'>Post Comment</Button>
      </Flex>
    </Card>
  );
}
