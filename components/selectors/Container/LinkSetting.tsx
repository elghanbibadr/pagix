// components/selectors/Link/LinkSettings.tsx
'use client';

import React from 'react';
import { useNode } from '@craftjs/core';
import { usePages } from '@/contexts/PageContext';

export const LinkSettings = () => {
  const {
    actions: { setProp },
    props,
  } = useNode((node) => ({
    props: node.data.props,
  }));

  const { pages } = usePages();

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Link Settings</h3>

      {/* Link Text */}
      <div>
        <label className="block text-sm font-medium mb-2">Link Text</label>
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
              // Reset other fields when switching
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
              id="openInNewTab"
              checked={props.openInNewTab || false}
              onChange={(e) =>
                setProp((props: any) => (props.openInNewTab = e.target.checked))
              }
              className="rounded"
            />
            <label htmlFor="openInNewTab" className="text-sm">
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

      {/* Font Size */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Font Size: {props.fontSize}px
        </label>
        <input
          type="range"
          min="10"
          max="48"
          value={props.fontSize || 16}
          onChange={(e) =>
            setProp((props: any) => (props.fontSize = e.target.value))
          }
          className="w-full"
        />
      </div>

      {/* Text Color */}
      <div>
        <label className="block text-sm font-medium mb-2">Text Color</label>
        <div className="flex items-center gap-2">
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
            className="w-12 h-10 rounded cursor-pointer"
          />
          <span className="text-sm text-gray-600">
            rgba({props.color.r}, {props.color.g}, {props.color.b}, {props.color.a})
          </span>
        </div>
      </div>

      {/* Text Align */}
      <div>
        <label className="block text-sm font-medium mb-2">Text Align</label>
        <div className="flex gap-2">
          {['left', 'center', 'right'].map((align) => (
            <button
              key={align}
              onClick={() => setProp((props: any) => (props.textAlign = align))}
              className={`px-3 py-2 rounded ${
                props.textAlign === align
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {align.charAt(0).toUpperCase() + align.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Margin */}
      <div>
        <label className="block text-sm font-medium mb-2">Margin (T R B L)</label>
        <div className="grid grid-cols-4 gap-2">
          {['Top', 'Right', 'Bottom', 'Left'].map((side, index) => (
            <input
              key={side}
              type="number"
              value={props.margin?.[index] || 0}
              onChange={(e) => {
                const newMargin = [...(props.margin || ['0', '0', '0', '0'])];
                newMargin[index] = e.target.value;
                setProp((props: any) => (props.margin = newMargin));
              }}
              placeholder={side}
              className="px-2 py-1 text-sm border rounded"
            />
          ))}
        </div>
      </div>
    </div>
  );
};