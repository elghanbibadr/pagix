import {hasLocale, NextIntlClientProvider} from 'next-intl';
import "../globals.css"
import { Toaster } from '@/components/ui/sonner';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
type Props = {
  children: React.ReactNode;
    params: Promise<{locale: string}>;

};
 
export default async function RootLayout({children,params}: Props) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
 
  // Enable static rendering
  setRequestLocale(locale);

  
  return (
    <html>
      <body  dir={`${locale === "he" ? "rtl" :"" }`} >
        <NextIntlClientProvider >{children}</NextIntlClientProvider>
        <Toaster/>
      </body>
    </html>
  );
}