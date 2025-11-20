'use client';

import DashboardSidebar from '@/components/dashboard/sidebar';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { Menu } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { UserMenu } from '../../../components/ui/user-menu';
import { getUser } from '../../actions/actions';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      console.log('user', user);
      setUser(user);
    };
    fetchUser();
  }, []);
  return (
    <div className='flex min-h-screen bg-background'>
      <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className='flex-1  flex flex-col overflow-auto'>
        <div
          className='flex items-center justify-between border-b-[1px] p-5 '
          style={{
            boxShadow:
              'var(--tw-inset-shadow, 0 0 #0000), var(--tw-inset-ring-shadow, 0 0 #0000), var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), 0 1px 2px 0 var(--tw-shadow-color, #0000000d)'
          }}
        >
          <Button
            variant='ghost'
            size='icon'
            className='md:flex lg:hidden border-'
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className='h-5 w-5' />
          </Button>
          <div className='flex-1' />
          <div className='flex items-center gap-3'>
            {user ? <UserMenu user={user} /> : null}
            <LanguageSwitcher />
          </div>
        </div>

        <div className='flex-1  overflow-hidden  '>{children}</div>
      </main>
    </div>
  );
}
