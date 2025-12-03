/* eslint-disable @typescript-eslint/no-explicit-any */
// app/[locale]/dashboard/builder/BuilderClient.tsx
'use client';

import { Editor, Frame, Element } from '@craftjs/core';
import { createTheme, ThemeProvider } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import { Viewport, RenderNode } from '@/components/editor';
import { Container, Text } from '@/components/selectors';
import { Button } from '@/components/selectors/Button';
import { Link as CustomLink } from '@/components/selectors/Link';
import { PageProvider, usePages } from '@/contexts/PageContext';
import { PageNavigation } from '@/components/PageNavigation';
import { useSearchParams } from 'next/navigation';
import { SettingsView } from '@/components/websitesSettings/view-settings';

const theme = createTheme({
  typography: {
    fontFamily: [
      'acumin-pro',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

interface BuilderClientProps {
  initialWebsite: any;
  initialPages: any[];
  websiteId: string;
}

const EditorContent = ({ pageContent }: { pageContent: any }) => {
  return (
    <Frame data={pageContent}>
      <Element
        canvas
        is={Container}
        width="100%"
        height="auto"
        background={{ r: 255, g: 255, b: 255, a: 1 }}
        padding={['40', '40', '40', '40']}
        custom={{ displayName: 'App' }}
      >
        {/* Content will be loaded from pageContent */}
      </Element>
    </Frame>
  );
};

const EditorWrapper: React.FC = () => {
  const { 
    setPreviewMode, 
    currentPage, 
    currentPageId, 
    isLoading, 
    setHasUnsavedChanges 
  } = usePages();
  const [isPreview, setIsPreview] = useState(false);
  const searchParams = useSearchParams();
  const showSettings = searchParams.get('view') === 'settings';
  
  const previousStateRef = useRef<string>(''); // ✅ Store serialized state
  const isInitializedRef = useRef(false);
  const previousPageIdRef = useRef(currentPageId);

  const handleNodesChange = (query: any) => {
    // ✅ Serialize current state
    const currentSerialized = JSON.stringify(query.serialize());
    
    // ✅ Skip if not initialized yet
    if (!isInitializedRef.current) {
      console.log('⏭️ Skipping - not initialized yet');
      previousStateRef.current = currentSerialized;
      isInitializedRef.current = true;
      return;
    }

    // ✅ Compare with previous state
    if (currentSerialized !== previousStateRef.current) {
      console.log('✏️ Content changed - marking as unsaved');
      setHasUnsavedChanges(true);
      previousStateRef.current = currentSerialized;
    } else {
      console.log('⏭️ No content change detected');
    }
  };

  // ✅ Reset when page changes
  useEffect(() => {
    if (previousPageIdRef.current !== currentPageId) {
      console.log('🔄 Page switched, resetting state tracking');
      
      // Reset unsaved changes
      setHasUnsavedChanges(false);
      
      // Mark as uninitialized so next change sets baseline
      isInitializedRef.current = false;
      previousPageIdRef.current = currentPageId;
    }
  }, [currentPageId, setHasUnsavedChanges]);

  // ✅ Reset when returning from settings
  useEffect(() => {
    if (showSettings === false) {
      // Mark as uninitialized to re-capture baseline
      isInitializedRef.current = false;
    }
  }, [showSettings]);

  // ✅ Reset on initial mount
  useEffect(() => {
    isInitializedRef.current = false;
    console.log('🎬 Initial mount - will capture baseline on first change');
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading editor...</p>
        </div>
      </div>
    );
  }

  if (!currentPage) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No page selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Settings View */}
      {showSettings && (
        <SettingsView onClose={() => {}} />
      )}
      
      {/* Editor */}
      {!showSettings && (
        <div className="flex-1 overflow-hidden">
          <Editor
            onNodesChange={handleNodesChange} // ✅ Pass query object
            resolver={{
              Text,
              Container,
              Button,
              CustomLink,
            }}
            enabled={!isPreview}
            onRender={RenderNode}
          >
            <Viewport>
              <EditorContent key={currentPageId} pageContent={currentPage.content} />
            </Viewport>
          </Editor>
        </div>
      )}
    </div>
  );
};
export default function BuilderClient({
  initialWebsite,
  initialPages,
  websiteId,
}: BuilderClientProps) {
  console.log('🎨 BuilderClient initialized with:', {
    websiteName: initialWebsite.name,
    pagesCount: initialPages.length,
  });

  return (
    <ThemeProvider theme={theme}>
      <PageProvider
        websiteId={websiteId}
        initialWebsite={initialWebsite}
        initialPages={initialPages}
      >
        <EditorWrapper />
      </PageProvider>
    </ThemeProvider>
  );
}