'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import PageCard from '@/components/dashboard/page-card';

interface Website {
  id: string;
  name: string;
  updated_at: string;
  is_published: boolean;
}

interface DashboardClientProps {
  websites: Website[];
  translations: {
    title: string;
    searchPlaceholder: string;
    publishedStatus: string;
    draftStatus: string;
  };
}

export function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${day}.${month}.${year}`;
}

export default function UserWebsites({ websites, translations }: DashboardClientProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter websites based on search query
  const filteredWebsites = websites.filter((website) => 
    website.name.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{translations.title}</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={translations.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {filteredWebsites.length > 0 ? (
          filteredWebsites.map((page) => (
            <PageCard
              key={page.id}
              website_id={page.id}
              title={page.name}
              date={formatDate(page.updated_at)}
              status={page.is_published ? translations.publishedStatus : translations.draftStatus}
            />
          ))
        ) : (
          <div className="col-span-3 text-center py-12 text-muted-foreground">
            {searchQuery ? (
              <p>No pages found matching &quot;{searchQuery}&quot;</p>
            ) : (
              <p>No pages yet. Create your first page to get started!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}