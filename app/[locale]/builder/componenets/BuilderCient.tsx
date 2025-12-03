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
//   userId: string;
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
  const { setPreviewMode, currentPage, currentPageId, isLoading,setHasUnsavedChanges } = usePages();
  const [isPreview, setIsPreview] = useState(false);
  const searchParams=useSearchParams()
  const showSettings = searchParams.get('view') === 'settings';

 const isInitialLoadRef = useRef(true); // ✅ Track if this is initial load

  const handleNodesChange = () => {
    // ✅ Skip the first call (initial load)
    if (isInitialLoadRef.current) {
      console.log('⏭️ Skipping initial nodes setup');
      isInitialLoadRef.current = false;
      return;
    }

    setHasUnsavedChanges(true)

    console.log('✏️ Nodes changed by user');
    // You can perform actions here, like marking as unsaved
  };

  // ✅ Reset the flag when page changes
  useEffect(() => {
    isInitialLoadRef.current = true;
  }, [currentPageId]);

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

  const handlePreviewToggle = () => {
    const newPreviewState = !isPreview;
    setIsPreview(newPreviewState);
    setPreviewMode(newPreviewState);
  };

  console.log('current page',currentPage)

  return (
    <div className="h-screen flex flex-col">
      {/* Top Bar */}
      <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Website Editor</h1>
        <div className="flex gap-2">
       
          {/* {isPreview && (
            <button
              onClick={handlePreviewToggle}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
            >
              Exit Preview
            </button>
          )} */}
        </div>
      </div>

      {/* Page Navigation */}

      {/* Editor */}
          {showSettings && (
  <SettingsView onClose={()=>{}} />
)}
     {!showSettings && <div className="flex-1 overflow-hidden">
        <Editor
         onNodesChange={handleNodesChange}
          resolver={{
            Text,
            Container,
            Button,
            CustomLink,
          }}
          enabled={!isPreview}
          onRender={RenderNode}
        >
      {/* <PageNavigation /> */}

          <Viewport>
            <EditorContent key={currentPageId} pageContent={currentPage.content} />
          </Viewport>
        </Editor>
      </div>}
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