// components/PageLoader.tsx
'use client';

import React, { useEffect } from 'react';
import { useEditor } from '@craftjs/core';
import { usePages } from '@/contexts/PageContext';

export const PageLoader: React.FC = () => {
  const { actions, query } = useEditor();
  const { currentPage, isPreviewMode } = usePages();


  console.log("current page",currentPage)
  // Load page content when switching pages
  useEffect(() => {
    if (currentPage && currentPage.content) {
      try {
        // Deserialize the saved content
        actions.deserialize(currentPage.content);

        console.log("current pages content",currentPage.content)
      } catch (error) {
        console.error('Error loading page content:', error);
      }
    }
  }, [currentPage?.id, actions]);

  // Listen for page navigation events (from link clicks)
  useEffect(() => {
    const handlePageNavigation = (event: CustomEvent) => {
      const { content } = event.detail;
      if (content) {
        try {
          actions.deserialize(content);
        } catch (error) {
          console.error('Error navigating to page:', error);
        }
      }
    };

    window.addEventListener('page-navigation', handlePageNavigation as EventListener);
    
    return () => {
      window.removeEventListener('page-navigation', handlePageNavigation as EventListener);
    };
  }, [actions]);

  // Auto-save content when it changes (only in edit mode)
  useEffect(() => {
    if (isPreviewMode) return; // Don't auto-save in preview mode

    const interval = setInterval(() => {
      if (currentPage) {
        const json = query.serialize();
        // You would typically save to a database here
        currentPage.content = json;
      }
    }, 2000); // Auto-save every 2 seconds

    return () => clearInterval(interval);
  }, [currentPage, query, isPreviewMode]);

  return null; // This is a logic-only component
};