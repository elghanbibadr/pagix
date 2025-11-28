// contexts/PageContext.tsx
'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { loadWebsite } from '@/app/actions/websitesActions';

interface Page {
  id: string;
  website_id: string;
  name: string;
  slug: string;
  content: any;
  meta_title?: string;
  meta_description?: string;
  is_home_page: boolean;
  is_published: boolean;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

interface Website {
  id: string;
  user_id: string;
  name: string;
  subdomain: string;
  is_published: boolean;
  preview_published: boolean;
  production_published: boolean;
}

interface PageContextType {
  website: Website | null;
  pages: Page[];
  currentPageId: string;
  currentPage: Page | undefined;
  isPreviewMode: boolean;
  isLoading: boolean;
  addPage: (name: string) => Promise<void>;
  deletePage: (id: string) => Promise<void>;
  renamePage: (id: string, newName: string) => Promise<void>;
  switchPage: (id: string) => void;
  updatePageContent: (id: string, content: any) => void;
  savePageContent: (id: string, content: any) => Promise<void>;
  setPreviewMode: (enabled: boolean) => void;
  navigateToPage: (pageId: string) => void;
  loadSite: (websiteId: string) => Promise<void>;
  setHomePage: (pageId: string) => Promise<void>;
}

const PageContext = createContext<PageContextType | undefined>(undefined);

export const PageProvider: React.FC<{ 
  children: React.ReactNode;
  websiteId?: string;
  initialWebsite?: Website;  // ✅ Add this
  initialPages?: Page[];     // ✅ Add this
}> = ({ children, websiteId, initialWebsite, initialPages }) => {
  // Initialize with server data
  const [website, setWebsite] = useState<Website | null>(initialWebsite || null);
  const [pages, setPages] = useState<Page[]>(initialPages || []);
  const [isLoading, setIsLoading] = useState(!initialWebsite); // Not loading if we have data

  const [currentPageId, setCurrentPageId] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const router = useRouter();
  const hasLoadedRef = useRef(false); // Track if we've already loaded


  // Add new page to database
  const addPage = useCallback(async (name: string) => {
    if (!website) {
      console.error('No website loaded');
      return;
    }

    try {
      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      console.log('Creating page:', name);
      
      // TODO: Use your createPage server action here
      
    } catch (error) {
      console.error('Error adding page:', error);
      throw error;
    }
  }, [website, pages]);

  // Delete page from database
  const deletePage = useCallback(async (id: string) => {
    if (!website) return;

    try {
      console.log('Deleting page:', id);
      // TODO: Use your deletePage server action here
    } catch (error) {
      console.error('Error deleting page:', error);
      throw error;
    }
  }, [website, currentPageId]);

  // Rename page in database
  const renamePage = useCallback(async (id: string, newName: string) => {
    try {
      console.log('Renaming page:', id, newName);
      // TODO: Use your updatePageMeta server action here
    } catch (error) {
      console.error('Error renaming page:', error);
      throw error;
    }
  }, []);

  // Switch page (local only, no DB call)
  const switchPage = useCallback((id: string) => {
    console.log('Switching to page:', id);
    setCurrentPageId(id);
  }, []);

  // Update page content in local state (optimistic update)
  const updatePageContent = useCallback((id: string, content: any) => {
    setPages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, content } : p))
    );
  }, []);

  // Save page content to database
  const savePageContent = useCallback(async (id: string, content: any) => {
    try {
      console.log('💾 Saving page content:', id);
      // TODO: Use your savePageContent server action here
    } catch (error) {
      console.error('Error saving page content:', error);
      throw error;
    }
  }, []);

  // Set a page as home page
  const setHomePage = useCallback(async (pageId: string) => {
    if (!website) return;

    try {
      console.log('Setting home page:', pageId);
      // TODO: Use your designateHomePage server action here
    } catch (error) {
      console.error('Error setting home page:', error);
      throw error;
    }
  }, [website]);

  // Navigate to page
  const navigateToPage = useCallback((pageId: string) => {
    const targetPage = pages.find(p => p.id === pageId);
    if (targetPage) {
      setCurrentPageId(pageId);
      
      if (isPreviewMode) {
        window.dispatchEvent(new CustomEvent('page-navigation', { 
          detail: { pageId, content: targetPage.content } 
        }));
      }
    }
  }, [pages, isPreviewMode]);

  const currentPage = pages.find((p) => p.id === currentPageId);

  console.log('📊 Context State:', {
    website: website?.name,
    pagesCount: pages.length,
    currentPageId,
    currentPageName: currentPage?.name,
    isLoading,
  });

  return (
    <PageContext.Provider
      value={{
        website,
        pages,
        currentPageId,
        currentPage,
        isPreviewMode,
        isLoading,
        addPage,
        deletePage,
        renamePage,
        switchPage,
        updatePageContent,
        savePageContent,
        setIsPreviewMode,
        navigateToPage,
        // loadSite,
        setHomePage,
      }}
    >
      {children}
    </PageContext.Provider>
  );
};

export const usePages = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error('usePages must be used within PageProvider');
  }
  return context;
};