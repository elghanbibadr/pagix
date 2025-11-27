// app/page.tsx
'use client';

import { Editor, Frame, Element } from '@craftjs/core';
import { createTheme, ThemeProvider } from '@mui/material';
import React, { useState } from 'react';

import { Viewport, RenderNode } from '@/components/editor';
import { Container, Text } from '@/components/selectors';
import { Button } from '@/components/selectors/Button';
import { Link } from '@/components/selectors/Link';
import { ButtonLink } from '@/components/selectors/ButtonLink';
import { PageProvider, usePages } from '@/contexts/PageContext';
import { PageNavigation } from '@/components/PageNavigation';
import { PageLoader } from '@/components/PageLoader';
import { TestLinks } from '@/components/ui/TestLinks';

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

const EditorContent= ({pageContent}:{pageContent:string}) => {
  return (
    <>
      {/* <PageLoader /> */}
      <Frame  data={pageContent}>
        <Element
          canvas
          is={Container}
          width="800px"
          height="auto"
          background={{ r: 255, g: 255, b: 255, a: 1 }}
          padding={['40', '40', '40', '40']}
          custom={{ displayName: 'App' }}
        >
          {/* <Text fontSize="23" fontWeight="400" text="Welcome to the page"></Text> */}
        </Element>
      </Frame>
    </>
  );
};

const EditorWrapper: React.FC = () => {
  const { setPreviewMode,currentPage,currentPageId } = usePages();
  const [isPreview, setIsPreview] = useState(false);

  console.log('current page',currentPage)

  const handlePreviewToggle = () => {
    const newPreviewState = !isPreview;
    setIsPreview(newPreviewState);
    setPreviewMode(newPreviewState);
  };

  return (
    <div className="h-full h-screen flex flex-col">
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
  {/* <TestLinks/> */}
      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          resolver={{
            Container,
            Text,
            Button,
            Link,
            ButtonLink,
          }}
          enabled={!isPreview} // Disable editing in preview mode
          onRender={RenderNode}
        >
          <Viewport>
      <PageNavigation />

            <EditorContent key={currentPageId} pageContent={currentPage.content} />
          </Viewport>
        </Editor>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <ThemeProvider theme={theme}>
      <PageProvider>
        <EditorWrapper />
      </PageProvider>
    </ThemeProvider>
  );
}