/* eslint-disable @typescript-eslint/no-explicit-any */
// app/[locale]/dashboard/builder/BuilderClient.tsx
'use client';

import { Editor, Frame, Element } from '@craftjs/core';
import { createTheme, ThemeProvider } from '@mui/material';
import React, { useState } from 'react';
import Link from 'next/link';

import { Viewport, RenderNode } from '@/components/editor';
import { Container, Text } from '@/components/selectors';
import { Button } from '@/components/selectors/Button';
import { Link as CustomLink } from '@/components/selectors/Link';
import { PageProvider, usePages } from '@/contexts/PageContext';
import { PageNavigation } from '@/components/PageNavigation';

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
        width="800px"
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
  const { setPreviewMode, currentPage, currentPageId, isLoading } = usePages();
  const [isPreview, setIsPreview] = useState(false);



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
          <button
            onClick={handlePreviewToggle}
            className={`px-4 py-2 rounded transition-colors ${
              isPreview
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isPreview ? '✓ Preview Mode' : 'Preview'}
          </button>
          {isPreview && (
            <button
              onClick={handlePreviewToggle}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
            >
              Exit Preview
            </button>
          )}
        </div>
      </div>

      {/* Page Navigation */}

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          resolver={{
            Text,
            Container,
            Button,
            CustomLink,
          }}
          enabled={!isPreview}
          onRender={RenderNode}
        >
      <PageNavigation />

          <Viewport>
            <EditorContent key={currentPageId} pageContent={currentPage.content} />
          </Viewport>
        </Editor>
      </div>
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