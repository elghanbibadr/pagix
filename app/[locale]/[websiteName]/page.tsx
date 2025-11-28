"use client"
import React from 'react'
import { EditorContent } from '../builder/page';
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
        
        <EditorContent pageContent='{"ROOT":{"type":{"resolvedName":"Container"},"isCanvas":true,"props":{"flexDirection":"column","alignItems":"flex-start","justifyContent":"flex-start","fillSpace":"no","padding":["40","40","40","40"],"margin":["0","0","0","0"],"background":{"r":255,"g":255,"b":255,"a":1},"color":{"r":0,"g":0,"b":0,"a":1},"shadow":0,"radius":0,"width":"800px","height":"auto"},"displayName":"Container","custom":{"displayName":"App"},"hidden":false,"nodes":[],"linkedNodes":{}},"PgFSksH561":{"type":{"resolvedName":"Container"},"isCanvas":true,"props":{"flexDirection":"column","alignItems":"flex-start","justifyContent":"flex-start","fillSpace":"no","padding":["0","0","0","0"],"margin":["0","0","0","0"],"background":{"r":78,"g":78,"b":78,"a":1},"color":{"r":0,"g":0,"b":0,"a":1},"shadow":0,"radius":0,"width":"300px","height":"300px"},"displayName":"Container","custom":{},"parent":"ROOT","hidden":false,"nodes":[],"linkedNodes":{}},"PGMIwsOPs8":{"type":{"resolvedName":"Button"},"isCanvas":false,"props":{"background":{"r":255,"g":255,"b":255,"a":0.5},"color":{"r":92,"g":90,"b":90,"a":1},"buttonStyle":"full","text":"hello","margin":["5","0","5","0"],"textComponent":{"fontSize":"15","textAlign":"center","fontWeight":"500","color":{"r":92,"g":90,"b":90,"a":1},"margin":[0,0,0,0],"shadow":0,"text":"Text"}},"displayName":"Button","custom":{},"parent":"ROOT","hidden":false,"nodes":[],"linkedNodes":{}}}' />
                    {/* <EditorContent key={currentPageId} pageContent={currentPage.content} /> */}
                  </Viewport>
                </Editor>
    </div>
  )
}

export default PreviewPage