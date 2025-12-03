// components/PageNavigation.tsx
'use client';

import React, { useState } from 'react';
import { usePages } from '@/contexts/PageContext';
import { useEditor } from '@craftjs/core';

export const PageNavigation: React.FC = () => {
  const { pages, currentPageId, addPage, deletePage, renamePage, switchPage,updatePageContent} = usePages();
    const { actions, query } = useEditor();

    console.log('current page id',currentPageId)
  
  const [isAddingPage, setIsAddingPage] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editPageName, setEditPageName] = useState('');

  const handleAddPage = () => {
    if (newPageName.trim()) {
      addPage(newPageName.trim());
      setNewPageName('');
      setIsAddingPage(false);
    }
  };

  const handleRenamePage = (id: string) => {
    if (editPageName.trim()) {
      renamePage(id, editPageName.trim());
      setEditingPageId(null);
      setEditPageName('');
    }
  };

  const startEditing = (id: string, currentName: string) => {
    setEditingPageId(id);
    setEditPageName(currentName);
  };

    const handleSave = () => {
    const editorStateJson = query.serialize();
    console.log( 'editorStateJson',editorStateJson)
    updatePageContent(currentPageId,editorStateJson)
    // You can now send this to a server, save it to local storage, etc.
  };

  const handleSwitching=(pageId:string) =>{
    handleSave();
    switchPage(pageId)
  }

  return (
    <div className="bg-gray-100 border-b border-gray-300 px-4 py-2 flex items-center gap-2 overflow-x-auto">
      {/* Page Tabs */}
      {pages.map((page) => (
        <div
          key={page.id}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-lg cursor-pointer transition-colors ${
            currentPageId === page.id
              ? 'bg-white border-t border-l border-r border-gray-300'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          {editingPageId === page.id ? (
            <input
              type="text"
              value={editPageName}
              onChange={(e) => setEditPageName(e.target.value)}
              onBlur={() => handleRenamePage(page.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRenamePage(page.id);
                if (e.key === 'Escape') {
                  setEditingPageId(null);
                  setEditPageName('');
                }
              }}
              className="px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          ) : (
            <>
              <span
                onClick={() => handleSwitching(page.id)}
                onDoubleClick={() => startEditing(page.id, page.name)}
                className="text-sm font-medium"
              >
                {page.name}
              </span>
              {pages.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete page "${page.name}"?`)) {
                      deletePage(page.id);
                    }
                  }}
                  className="text-gray-500 hover:text-red-600 transition-colors"
                  title="Delete page"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </>
          )}
        </div>
      ))}

      {/* Add New Page */}
      {isAddingPage ? (
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-t-lg">
          <input
            type="text"
            value={newPageName}
            onChange={(e) => setNewPageName(e.target.value)}
            onBlur={handleAddPage}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddPage();
              if (e.key === 'Escape') {
                setIsAddingPage(false);
                setNewPageName('');
              }
            }}
            placeholder="Page name..."
            className="px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        </div>
      ) : (
        <button
          onClick={() => setIsAddingPage(true)}
          className="flex items-center gap-1 px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-t-lg transition-colors"
          title="Add new page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>New Page</span>
        </button>
      )}
    </div>
  );
};