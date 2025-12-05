// components/editor/Sidebar/PageNavigationPanel.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { usePages } from '@/contexts/PageContext';
import { Plus, Trash2, Edit2, Check, X, Home } from 'lucide-react';
import { useEditor } from '@craftjs/core';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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
    renamePage,
    setHasUnsavedChanges,
    updatePageContent
  } = usePages();
  
  const [newPageName, setNewPageName] = useState('');
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editingPageName, setEditingPageName] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { actions, query } = useEditor();

  // ✅ Auto-focus input when isAddingPage becomes true
  useEffect(() => {
    if (isAddingPage) {
      setTimeout(() => {
        const input = document.querySelector('input[placeholder="Page name..."]') as HTMLInputElement;
        if (input) input.focus();
      }, 50);
    }
  }, [isAddingPage]);

  // ✅ Save current page content before adding new page
  const handleAddPage = () => {
    // CHECKING IF A PAGE WITH SAME NAME EXISTS
    const isExists=pages.some(page => page.name===newPageName)
    if(isExists){
      toast.error('page with similar name exists !')
      setNewPageName('')
      setIsAddingPage(false)
      return
    }
    console.log("current pages",pages)
    if (newPageName.trim()) {
      // Save current page content before creating new page
      const editorStateJson = query.serialize();
      console.log('💾 Saving current page before adding new page');
      updatePageContent(currentPageId, editorStateJson);
      
      // Add new page
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

  // ✅ Open delete confirmation dialog
  const handleDeleteClick = (pageId: string, pageName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPageToDelete({ id: pageId, name: pageName });
    setShowDeleteDialog(true);
  };

  // ✅ Confirm and delete page
  const handleConfirmDelete = async () => {
    if (!pageToDelete) return;

    setIsDeleting(true);
    
    try {
      await deletePage(pageToDelete.id);
      toast.success(`Page "${pageToDelete.name}" deleted successfully!`);
      setShowDeleteDialog(false);
      setPageToDelete(null);
    } catch (error) {
      console.error('❌ Failed to delete page:', error);
      toast.error('Failed to delete page. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // ✅ Save current page before switching
  const handleSwitching = (pageId: string) => {
    const editorStateJson = query.serialize();
    console.log('💾 Saving current page before switching');
    updatePageContent(currentPageId, editorStateJson);
    switchPage(pageId);
    setHasUnsavedChanges(false);
  };

  return (
    <>
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
                    <div className="flex items-center gap-1">
                           {page.is_home_page && (

                          <Home height={15} />
                      )}
                     <span className="text-xs font-medium text-gray-700 truncate">
  {!page.is_home_page && <span>/ </span>}
  {page.name}
</span>
                 
                    </div>
                    {/* <span className="text-xs text-gray-500">
                      {page.slug}
                    </span> */}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {pages.length > 1 && (
                      <button
                        onClick={(e) => handleDeleteClick(page.id, page.name, e)}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={(open) => {
        if (!isDeleting) {
          setShowDeleteDialog(open);
          if (!open) {
            setPageToDelete(null);
          }
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete Page?
              </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-semibold">&quot;{pageToDelete?.name}&quot;</span>? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <Button
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              variant="destructive"
            >
            {isDeleting ? (
  <>
    <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    Deleting...
  </>
) : (
   <>
   <Trash2 className='text-white' />
    <span className='text-white'>Delete Page...</span>
  </>
)}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};