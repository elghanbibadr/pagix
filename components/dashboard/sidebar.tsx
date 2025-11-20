'use client';
import { Button } from '@/components/ui/button';
import logo from '@/public/icons/logo.png';
import { Home, Plus, Settings, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface DashboardSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function DashboardSidebar({ isOpen = false, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('sidebar');
  const isRTL = locale === 'he';

  // Remove locale from pathname for comparison
  const pathnameWithoutLocale = pathname.replace(`/${locale}`, '') || '/';

  const navItems = [
    { href: '/dashboard', label: t('dashboard'), icon: Home },
    { href: '/builder', label: t('createPage'), icon: Plus }
    // { href: '/settings', label: t('settings'), icon: Settings }
  ];

  // Close sidebar when navigating on mobile/tablet
  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay for mobile/tablet */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300'
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 z-50
          ${isRTL ? 'right-0' : 'left-0'}
          w-72 ${isRTL ? 'border-l' : 'border-r'} border-border bg-background h-screen
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${
            isOpen
              ? 'translate-x-0'
              : isRTL
              ? 'translate-x-full lg:translate-x-0'
              : '-translate-x-full lg:translate-x-0'
          }
        `}
      >
        {/* Close button for mobile/tablet */}
        <div className='flex items-center justify-between p-6 lg:hidden border-b border-border'>
          <Link
            href={`/${locale}/dashboard`}
            className='flex items-center gap-2'
            onClick={handleLinkClick}
          >
            <Image src={logo} alt='pagix logo' height={120} width={120} />
          </Link>
          <Button variant='ghost' size='icon' onClick={onClose}>
            <X className='h-5 w-5' />
          </Button>
        </div>

        {/* Logo for desktop */}
        <div className='hidden lg:block p-6'>
          <Link href={`/${locale}/dashboard`} className='flex items-center gap-2'>
            <Image src={logo} alt='pagix logo' height={120} width={120} />
          </Link>
        </div>

        {/* Navigation */}
        <nav className='flex-1 p-4 pt-2 space-y-2'>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive =
              pathnameWithoutLocale === item.href ||
              pathnameWithoutLocale.startsWith(item.href + '/');

            return (
              <Link key={item.href} href={`/${locale}${item.href}`} onClick={handleLinkClick}>
                <span
                  className={`w-full flex items-center text-sm font-medium mb-1 py-2 ${
                    isActive ? 'text-[#f4b300] bg-[#fbf9fa]' : ''
                  } hover:text-[#f4b300] hover:bg-[#fbf9fa] px-2 py-2 rounded-md bg-none justify-start gap-3 duration-75 transition-all ease-in group`}
                >
                  <Icon
                    className={`w-5 font-normal h-5 ${
                      isActive ? 'text-[#f4b300]' : 'text-[#99a1af] group-hover:text-[#f4b300]'
                    }`}
                  />
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
        {/* User Profile & Logout */}
        <div className='p-4 '>
          <Link key='/settings' href={`/${locale}/settings`} onClick={handleLinkClick}>
            <span
              className={`w-full flex items-center text-sm font-medium mb-1 py-2 pointer ${
                pathnameWithoutLocale === '/settings' ? 'text-[#f4b300] bg-[#fbf9fa]' : ''
              } hover:text-[#f4b300] hover:bg-[#fbf9fa] px-2 py-2 rounded-md bg-none justify-start gap-3 duration-75 transition-all ease-in group`}
            >
              <Settings
                className={`w-5 font-normal h-5 ${
                  pathnameWithoutLocale === '/settings'
                    ? 'text-[#f4b300]'
                    : 'text-[#99a1af] group-hover:text-[#f4b300]'
                }`}
              />
              {t('settings')}
            </span>
          </Link>
        </div>
      </aside>
    </>
  );
}
