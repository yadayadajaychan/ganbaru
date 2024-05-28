import { CaretDownIcon } from '@radix-ui/react-icons';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { Text } from '@radix-ui/themes';

export default function Nav() {
  return (
    <NavigationMenu.Root>
      <NavigationMenu.List className='flex flex-row gap-4'>
        <NavigationMenu.Item>
          <NavigationMenu.Link
            className='roup flex select-none items-center justify-betwee gap-[2px] rounded-[4px] px-3 py-2'
            href='/'
          >
            <Text size='2'>Home</Text>
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Trigger className='hover:bg-purple-300 hover:bg-opacity-10 group flex select-none items-center justify-between gap-[2px] rounded-[4px] px-3 py-2'>
            <Text size='2'>Classes</Text>
            <CaretDownIcon
              className='relative top-[1px] transition-transform duration-[250] ease-in group-data-[state=open]:-rotate-180'
              aria-hidden
            />
          </NavigationMenu.Trigger>
          <NavigationMenu.Content></NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
