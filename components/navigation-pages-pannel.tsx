// components/editor/Sidebar/PageNavigationPanel.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { usePages } from '@/contexts/PageContext';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { useEditor } from '@craftjs/core';

interface PageNavigationPanelProps {
  isAddingPage: boolean;
  setIsAddingPage: (value: boolean) => void;
}

export const PageNavigationPanel: React.FC<PageNavigationPanelProps> = ({ 
  isAddingPage, 
  setIsAddingPage 
}) => {
  const { 
    pages, 
    currentPageId, 
    switchPage, 
    addPage, 
    deletePage, 
    renamePage ,
    setHasUnsavedChanges,
    updatePageContent
  } = usePages();
  
  const [newPageName, setNewPageName] = useState('');
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editingPageName, setEditingPageName] = useState('');
      const { actions, query } = useEditor();
  

  // ✅ Auto-focus input when isAddingPage becomes true
  useEffect(() => {
    if (isAddingPage) {
      // Small delay to ensure input is rendered
      setTimeout(() => {
        const input = document.querySelector('input[placeholder="Page name..."]') as HTMLInputElement;
        if (input) input.focus();
      }, 50);
    }
  }, [isAddingPage]);

  const handleAddPage = () => {
    if (newPageName.trim()) {
      addPage(newPageName.trim());
      setNewPageName('');
      setIsAddingPage(false);
    }
  };

  const handleStartEdit = (pageId: string, currentName: string) => {
    setEditingPageId(pageId);
    setEditingPageName(currentName);
  };

  const handleSaveEdit = () => {
    if (editingPageId && editingPageName.trim()) {
      renamePage(editingPageId, editingPageName.trim());
      setEditingPageId(null);
      setEditingPageName('');
    }
  };

  const handleCancelEdit = () => {
    setEditingPageId(null);
    setEditingPageName('');
  };

  const handleDeletePage = (pageId: string) => {
    if (confirm('Are you sure you want to delete this page?')) {
      deletePage(pageId);
    }
  };


    const handleSwitching=(pageId:string) =>{
      const editorStateJson = query.serialize();
    console.log( 'editorStateJson',editorStateJson)
    updatePageContent(currentPageId,editorStateJson)
    switchPage(pageId)
    setHasUnsavedChanges(false)
  }

  return (
    <div className="p-3">
      {/* Add Page Input - Shown when Plus icon is clicked */}
      {isAddingPage && (
        <div className="mb-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={newPageName}
              onChange={(e) => setNewPageName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddPage();
                if (e.key === 'Escape') {
                  setIsAddingPage(false);
                  setNewPageName('');
                }
              }}
              placeholder="Page name..."
              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              onClick={handleAddPage}
              className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              <Check size={16} />
            </button>
            <button
              onClick={() => {
                setIsAddingPage(false);
                setNewPageName('');
              }}
              className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Pages List */}
      <div className="space-y-2">
        {pages.map((page) => (
          <div
            key={page.id}
            className={`
              group relative p-2 rounded cursor-pointer transition
              ${currentPageId === page.id 
                ? 'bg-blue-100 border-l-4 border-blue-500' 
                : 'bg-gray-50 hover:bg-gray-100 border-l-4 border-transparent'
              }
            `}
          >
            {editingPageId === page.id ? (
              // Edit Mode
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={editingPageName}
                  onChange={(e) => setEditingPageName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit();
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <button
                  onClick={handleSaveEdit}
                  className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="p-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              // View Mode
              <div className="flex items-center justify-between">
                <div
                  onClick={() => handleSwitching(page.id)}
                  className="flex-1 min-w-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 truncate">
                      {page.name}
                    </span>
                    {page.is_home_page && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                        Home
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {page.slug}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartEdit(page.id, page.name);
                    }}
                    className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                    title="Rename"
                  >
                    <Edit2 size={14} />
                  </button> */}
                  {pages.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePage(page.id);
                      }}
                      className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {pages.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">
          No pages yet. Create your first page!
        </div>
      )}
    </div>
  );
};