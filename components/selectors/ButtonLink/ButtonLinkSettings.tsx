// components/selectors/ButtonLink/ButtonLinkSettings.tsx
'use client';

import React from 'react';
import { useNode } from '@craftjs/core';
import { usePages } from '@/contexts/PageContext';

export const ButtonLinkSettings = () => {
  const {
    actions: { setProp },
    props,
  } = useNode((node) => ({
    props: node.data.props,
  }));

  const { pages } = usePages();

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Button Link Settings</h3>

      {/* Button Text */}
      <div>
        <label className="block text-sm font-medium mb-2">Button Text</label>
        <input
          type="text"
          value={props.text || ''}
          onChange={(e) => setProp((props: any) => (props.text = e.target.value))}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Link Type */}
      <div>
        <label className="block text-sm font-medium mb-2">Link Type</label>
        <select
          value={props.linkType || 'external'}
          onChange={(e) => {
            setProp((props: any) => {
              props.linkType = e.target.value;
              if (e.target.value === 'internal') {
                props.href = '#';
              } else {
                props.targetPageId = '';
              }
            });
          }}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="external">External URL</option>
          <option value="internal">Internal Page</option>
        </select>
      </div>

      {/* External URL */}
      {props.linkType === 'external' && (
        <>
          <div>
            <label className="block text-sm font-medium mb-2">URL</label>
            <input
              type="url"
              value={props.href || ''}
              onChange={(e) => setProp((props: any) => (props.href = e.target.value))}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="buttonOpenInNewTab"
              checked={props.openInNewTab || false}
              onChange={(e) =>
                setProp((props: any) => (props.openInNewTab = e.target.checked))
              }
              className="rounded"
            />
            <label htmlFor="buttonOpenInNewTab" className="text-sm">
              Open in new tab
            </label>
          </div>
        </>
      )}

      {/* Internal Page Selection */}
      {props.linkType === 'internal' && (
        <div>
          <label className="block text-sm font-medium mb-2">Target Page</label>
          <select
            value={props.targetPageId || ''}
            onChange={(e) =>
              setProp((props: any) => (props.targetPageId = e.target.value))
            }
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a page...</option>
            {pages.map((page) => (
              <option key={page.id} value={page.id}>
                {page.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Background Color */}
      <div>
        <label className="block text-sm font-medium mb-2">Background Color</label>
        <input
          type="color"
          value={`#${((1 << 24) + (props.background.r << 16) + (props.background.g << 8) + props.background.b).toString(16).slice(1)}`}
          onChange={(e) => {
            const hex = e.target.value;
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            setProp((props: any) => {
              props.background = { r, g, b, a: props.background.a };
            });
          }}
          className="w-full h-10 rounded cursor-pointer"
        />
      </div>

      {/* Text Color */}
      <div>
        <label className="block text-sm font-medium mb-2">Text Color</label>
        <input
          type="color"
          value={`#${((1 << 24) + (props.color.r << 16) + (props.color.g << 8) + props.color.b).toString(16).slice(1)}`}
          onChange={(e) => {
            const hex = e.target.value;
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            setProp((props: any) => {
              props.color = { r, g, b, a: props.color.a };
            });
          }}
          className="w-full h-10 rounded cursor-pointer"
        />
      </div>

      {/* Border Radius */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Border Radius: {props.borderRadius}px
        </label>
        <input
          type="range"
          min="0"
          max="50"
          value={props.borderRadius || 8}
          onChange={(e) =>
            setProp((props: any) => (props.borderRadius = e.target.value))
          }
          className="w-full"
        />
      </div>
    </div>
  );
};