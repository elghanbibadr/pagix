// components/selectors/Link.tsx
import { useNode } from '@craftjs/core';
import { useRouter } from 'next/navigation';
import React from 'react';
import { usePages } from '@/contexts/PageContext';
import { LinkSettings } from './LinkSettings';

export const Link = ({ 
  text = 'Link text', 
  targetPage = '',
  color = '#1976d2',
  fontSize = '16',
  textDecoration = 'underline',
  ...props 
}) => {
  const router = useRouter();
  const { pages, isPreviewMode } = usePages();
  
  const {
    connectors: { connect, drag },
  } = useNode();

  const handleClick = (e: React.MouseEvent) => {
    if (isPreviewMode && targetPage) {
      e.preventDefault();
      const page = pages.find(p => p.id === targetPage);
      if (page) {
        router.push(`/editor/${page.id}`);
      }
    }
  };

  return (
    
     <a ref={(ref) => connect(drag(ref))}
      href="about"
      onClick={handleClick}
      style={{
        color,
        fontSize: `${fontSize}px`,
        textDecoration,
        cursor: 'pointer',
        display: 'inline-block',
      }}
      {...props}
    >
      {text}
    </a>
  );
};

Link.craft = {
  displayName: 'Link',
  props: {
    text: 'Link text',
    targetPage: '',
    color: '#1976d2',
    fontSize: '16',
    textDecoration: 'underline',
  },
  related: {
    toolbar: LinkSettings, // We'll create this next
  },
};