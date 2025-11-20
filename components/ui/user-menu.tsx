'use client';

import { logout } from '@/app/actions/actions';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Home, LogOut } from 'lucide-react';
import Link from 'next/link';

interface UserMenuProps {
  user: {
    name: string;
    email: string;
    image?: string;
  } | null;
}

export function UserMenu({ user }: { user: any }) {
  if (!user) return null;

  console.log('user 3', user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-10 w-10 rounded-full'>
          <Avatar className='h-10 w-10'>
            {/* <Image height={20} width={20} src={user.user.user_metadata.avatar_url} alt={user.user.user_metadata.full_name} /> */}
            <AvatarFallback>{user.user.user_metadata.full_name[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>{user.user.user_metadata.full_name}</p>
            <p className='text-xs leading-none text-muted-foreground'>{user.user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href='/dashboard' className='cursor-pointer'>
            <Home className='mr-2 h-4 w-4' />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => logout()} className='cursor-pointer'>
          <LogOut className='mr-2 h-4 w-4' />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
