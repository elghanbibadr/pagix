// contexts/PageContext.tsx
'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useEditor } from '@craftjs/core';

interface Page {
  id: string;
  name: string;
  content: string; // Serialized Craft.js content
}

interface PageContextType {
  pages: Page[];
  currentPageId: string;
  currentPage: Page | undefined;
  isPreviewMode: boolean;
  addPage: (name: string) => void;
  deletePage: (id: string) => void;
  renamePage: (id: string, newName: string) => void;
  switchPage: (id: string) => void;
  updatePageContent: (id: string, content: string) => void;
  setPreviewMode: (enabled: boolean) => void;
  navigateToPage: (pageId: string) => void; // New method for navigation
}

const PageContext = createContext<PageContextType | undefined>(undefined);

export const PageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
// Test it by modifying your PageContext initial state temporarily
const [pages, setPages] = useState<Page[]>([
  {
    id: 'page-1',
    name: 'Home',
    content: '',
  },
  {
    id: 'page-2',
    name: 'About',
    content: '',
  },
  {
    id: 'page-3',
    name: 'Contact',
    content: '',
  },
]);
  const [currentPageId, setCurrentPageId] = useState('page-1');
  const [isPreviewMode, setIsPreviewMode] = useState(false);


  console.log('pages list',pages)
  const addPage = useCallback((name: string) => {
    const newPage: Page = {
      id: `page-${Date.now()}`,
      name,
      content: '',
    };
    setPages((prev) => [...prev, newPage]);
    setCurrentPageId(newPage.id);
  }, []);

  const deletePage = useCallback((id: string) => {
    setPages((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      if (filtered.length === 0) return prev;
      
      if (id === currentPageId) {
        setCurrentPageId(filtered[0].id);
      }
      return filtered;
    });
  }, [currentPageId]);

  const renamePage = useCallback((id: string, newName: string) => {
    setPages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name: newName } : p))
    );
  }, []);

  const switchPage = useCallback((id: string) => {
    setCurrentPageId(id);
  }, []);

  const updatePageContent = useCallback((id: string, content: string) => {
    setPages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, content } : p))
    );
  }, []);

  // New method specifically for navigation (used by links)
  const navigateToPage = useCallback((pageId: string) => {
    const targetPage = pages.find(p => p.id === pageId);
    if (targetPage) {
      setCurrentPageId(pageId);
      
      // In preview mode, we need to trigger content reload
      if (isPreviewMode) {
        // Dispatch custom event that will be caught by the editor
        window.dispatchEvent(new CustomEvent('page-navigation', { 
          detail: { pageId, content: targetPage.content } 
        }));
      }
    }
  }, [pages, isPreviewMode]);

  const currentPage = pages.find((p) => p.id === currentPageId);

  return (
    <PageContext.Provider
      value={{
        pages,
        currentPageId,
        currentPage,
        isPreviewMode,
        addPage,
        deletePage,
        renamePage,
        switchPage,
        updatePageContent,
        setIsPreviewMode,
        navigateToPage,
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