// components/selectors/ButtonLink.tsx
'use client';

import { useNode, useEditor } from '@craftjs/core';
import React from 'react';
import { usePages } from '@/contexts/PageContext';
import { ButtonLinkSettings } from './ButtonLinkSettings';

export interface ButtonLinkProps {
  text?: string;
  href?: string;
  linkType?: 'internal' | 'external';
  targetPageId?: string;
  openInNewTab?: boolean;
  background?: { r: number; g: number; b: number; a: number };
  color?: { r: number; g: number; b: number; a: number };
  borderRadius?: string;
  padding?: string[];
  margin?: string[];
}

export const ButtonLink: React.FC<ButtonLinkProps> = ({
  text = 'Click me',
  href = '#',
  linkType = 'external',
  targetPageId,
  openInNewTab = false,
  background = { r: 59, g: 130, b: 246, a: 1 },
  color = { r: 255, g: 255, b: 255, a: 1 },
  borderRadius = '8',
  padding = ['12', '24', '12', '24'],
  margin = ['0', '0', '0', '0'],
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

  const handleClick = (e: React.MouseEvent) => {
    // In edit mode, prevent navigation
    if (enabled && !isPreviewMode) {
      e.preventDefault();
      return;
    }

    // In preview/production mode, allow navigation
    e.preventDefault();
    
    if (linkType === 'internal' && targetPageId) {
      navigateToPage(targetPageId);
    } else if (linkType === 'external' && href) {
      if (openInNewTab) {
        window.open(href, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = href;
      }
    }
  };

  return (
    <button
      ref={(ref) => ref && connect(drag(ref))}
      onClick={handleClick}
      className={`cursor-pointer transition-all hover:opacity-80 ${
        selected ? 'outline outline-2 outline-blue-500' : ''
      }`}
      style={{
        backgroundColor: `rgba(${background.r}, ${background.g}, ${background.b}, ${background.a})`,
        color: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
        borderRadius: `${borderRadius}px`,
        padding: `${padding[0]}px ${padding[1]}px ${padding[2]}px ${padding[3]}px`,
        margin: `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px`,
        border: 'none',
        fontWeight: 500,
        pointerEvents: enabled && !isPreviewMode ? 'none' : 'auto',
      }}
    >
      {text}
    </button>
  );
};

ButtonLink.craft = {
  displayName: 'Button Link',
  props: {
    text: 'Click me',
    href: '#',
    linkType: 'external',
    targetPageId: '',
    openInNewTab: false,
    background: { r: 59, g: 130, b: 246, a: 1 },
    color: { r: 255, g: 255, b: 255, a: 1 },
    borderRadius: '8',
    padding: ['12', '24', '12', '24'],
    margin: ['0', '0', '0', '0'],
  },
  related: {
    toolbar: ButtonLinkSettings,
  },
};