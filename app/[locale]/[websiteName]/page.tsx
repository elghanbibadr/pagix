"use client"
import React from 'react'
import { Editor } from '@craftjs/core';
import { Container, Text } from '@/components/selectors';
import { Button } from '@/components/selectors/Button';
import { Viewport, RenderNode } from '@/components/editor';


const PreviewPage = () => {
   
    //   const { setPreviewMode,currentPage,currentPageId } = usePages();

    //   console.log("pages",currentPage)

  return (
    <div>
          <Editor
                  resolver={{
                    Container,
                    // Text,
                    Button,
                    // CustomLink,
                    // ButtonLink,
                  }}
                  enabled={false} // Disable editing in preview mode
                  onRender={RenderNode}
                >
                  <Viewport>
        
                    {/* <EditorContent key={currentPageId} pageContent={currentPage.content} /> */}
                  </Viewport>
                </Editor>
    </div>
  )
}

export default PreviewPage