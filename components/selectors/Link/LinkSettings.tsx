// components/selectors/Link/LinkSettings.tsx
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
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Link Text
        </label>
        <input
          type="text"
          value={props.text || ''}
          onChange={(e) => setProp((props) => (props.text = e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter link text"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Link to Page
        </label>
        <select
          value={props.targetPage || ''}
          onChange={(e) => setProp((props) => (props.targetPage = e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a page...</option>
          {pages.map((page) => (
            <option key={page.id} value={page.id}>
              {page.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Text Color
        </label>
        <input
          type="color"
          value={props.color || '#1976d2'}
          onChange={(e) => setProp((props) => (props.color = e.target.value))}
          className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Font Size
        </label>
        <input
          type="range"
          min="12"
          max="32"
          value={props.fontSize || 16}
          onChange={(e) => setProp((props) => (props.fontSize = e.target.value))}
          className="w-full"
        />
        <span className="text-sm text-gray-600">{props.fontSize}px</span>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Text Decoration
        </label>
        <select
          value={props.textDecoration || 'underline'}
          onChange={(e) => setProp((props) => (props.textDecoration = e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="none">None</option>
          <option value="underline">Underline</option>
          <option value="overline">Overline</option>
          <option value="line-through">Line Through</option>
        </select>
      </div>
    </div>
  );
};