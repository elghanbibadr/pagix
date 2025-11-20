'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'he', name: 'עברית', flag: '🇮🇱' }
];

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const switchLanguage = (newLocale: string) => {
    // Get the current path without the locale
    const segments = pathname.split('/').filter(Boolean);
    const pathWithoutLocale = segments.slice(1).join('/');

    // Navigate to the new locales
    router.push(`/${newLocale}/${pathWithoutLocale}`);
  };

  const currentLanguage = languages.find(lang => lang.code === locale);

  return (
    <div className='border-[1px] rounded-md focus:border-none'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='sm' className='gap-2'>
            <span className='text-lg'>{currentLanguage?.flag}</span>
            <span className='hidden sm:inline font-medium'>{currentLanguage?.name}</span>
            {/* <Languages className='h-4 w-4 hidden sm:block' /> */}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          {languages.map(language => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => switchLanguage(language.code)}
              className={locale === language.code ? 'bg-accent' : ''}
            >
              <span className='mr-2 text-lg'>{language.flag}</span>
              {language.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
