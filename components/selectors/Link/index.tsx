// components/selectors/Link.tsx
'use client';

import { useNode, useEditor } from '@craftjs/core';
import React, { useRef, useEffect } from 'react';
import { usePages } from '@/contexts/PageContext';

export interface LinkProps {
  text?: string;
  href?: string;
  linkType?: 'internal' | 'external';
  targetPageId?: string;
  openInNewTab?: boolean;
  fontSize?: string;
  color?: { r: number; g: number; b: number; a: number };
  textAlign?: string;
  margin?: string[];
  padding?: string[];
}

export const Link: React.FC<LinkProps> = ({
  text = 'Click here',
  href = '#',
  linkType = 'external',
  targetPageId,
  openInNewTab = false,
  fontSize = '16',
  color = { r: 59, g: 130, b: 246, a: 1 },
  textAlign = 'left',
  margin = ['0', '0', '0', '0'],
  padding = ['0', '0', '0', '0'],
}) => {
  const {
    connectors: { connect, drag },
    selected,
  } = useNode((state) => ({
    selected: state.events.selected,
  }));

  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  const { navigateToPage, isPreviewMode } = usePages();
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (ref.current) {
      connect(drag(ref.current));
    }
  }, [connect, drag]);

  const handleClick = (e: React.MouseEvent) => {
    // In edit mode, prevent navigation
    if (enabled && !isPreviewMode) {
      e.preventDefault();
      return;
    }

    // In preview/production mode, allow navigation
    e.preventDefault();
    
    if (linkType === 'internal' && targetPageId) {
      // Navigate to internal page
      navigateToPage(targetPageId);
    } else if (linkType === 'external' && href) {
      // Open external link
      if (openInNewTab) {
        window.open(href, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = href;
      }
    }
  };

  return (
    
     <a ref={ref}
      href={href}
      onClick={handleClick}
      className={`cursor-pointer hover:underline transition-colors ${
        selected ? 'outline outline-2 outline-blue-500' : ''
      }`}
      style={{
        fontSize: `${fontSize}px`,
        color: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
        textAlign: textAlign as any,
        margin: `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px`,
        padding: `${padding[0]}px ${padding[1]}px ${padding[2]}px ${padding[3]}px`,
        display: 'inline-block',
        textDecoration: 'none',
        pointerEvents: enabled && !isPreviewMode ? 'none' : 'auto',
      }}
    >
      {text}
    </a>
  );
};