/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// contexts/PageContext.tsx
'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { addPageAction, deletePageAction, updatePageContentAction } from '@/app/actions/websitesActions';

interface Page {
  id: string;
  website_id: string;
  name: string;
  slug: string;
  content: any;
  meta_title?: string;
  meta_description?: string;
  is_home_page: boolean;
  is_published: boolean;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

interface Website {
  id: string;
  user_id: string;
  name: string;
  subdomain: string;
  description:string;
  is_published: boolean;
  preview_published: boolean;
  production_published: boolean;
}

type ChangeType = 'created' | 'updated' | 'deleted' | 'renamed';

interface PageChange {
  type: ChangeType;
  pageId: string;
  data?: Partial<Page>;
}

interface PageContextType {
  website: Website | null;
  pages: Page[];
  setPages:any ;
  currentPageId: string;
  currentPage: Page | undefined;
  isPreviewMode: boolean;
  isLoading: boolean;
  pendingChanges:any,
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  addPage: (name: string) => void;
  deletePage: (id: string) => void;
  renamePage: (id: string, newName: string) => void;
  switchPage: (id: string) => void;
  updatePageContent: (id: string, content: any) => void;
  saveAllChanges: (currentEditorContent?: { pageId: string; content: any }) => Promise<void>; // ✅ Add optional param
  setPreviewMode?: (enabled: boolean) => void;
  navigateToPage: (pageId: string) => void;
  setHomePage: (pageId: string) => Promise<void>;
  setHasUnsavedChanges:any
}

const PageContext = createContext<PageContextType | undefined>(undefined);

export const PageProvider: React.FC<{ 
  children: React.ReactNode;
  websiteId?: string;
  initialWebsite?: Website;
  initialPages?: Page[];
}> = ({ children, initialWebsite, initialPages }) => {
  const [website, setWebsite] = useState<Website | null>(initialWebsite || null);
  const [pages, setPages] = useState<Page[]>(initialPages || []);
  const [isLoading, setIsLoading] = useState(!initialWebsite);
  const [isSaving, setIsSaving] = useState(false);
  const [currentPageId, setCurrentPageId] = useState(initialPages?.[0]?.id || '');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [hasUnsavedChanges,setHasUnsavedChanges]=useState(false)
  const [pendingChanges, setPendingChanges] = useState<Map<string, PageChange>>(new Map());
  // const hasUnsavedChanges = pendingChanges.size > 0;

  console.log('has unsaved',hasUnsavedChanges)
  



  // ✅ Use empty string "" as default content
  const addPage = useCallback((name: string) => {
    if (!website) {
      console.error('No website loaded');
      return;
    }

    const tempId = `temp_${crypto.randomUUID()}`;
    const now = new Date().toISOString();
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    const newPage: Page = {
      id: tempId,
      website_id: website.id,
      name,
      slug,
      content: "", // ✅ Empty string for blank page
      is_home_page: false,
      is_published: false,
      meta_title: undefined,
      meta_description: undefined,
      order_index: pages.length,
      created_at: now,
      updated_at: now,
    };


    setPages(prev => [...prev, newPage]);
    
    setPendingChanges(prev => {
      const updated = new Map(prev);
      updated.set(tempId, {
        type: 'created',
        pageId: tempId,
        data: newPage,
      });
      return updated;
    });
    
    setCurrentPageId(tempId);
    
  }, [website]);

  const deletePage = useCallback((id: string) => {
    if (!website) return;

    console.log('🗑️ Deleting page:', id);

    setPages(prev => {
      const updated = prev.filter(p => p.id !== id);

      if (currentPageId === id) {
        if (updated.length > 0) {
          setCurrentPageId(updated[0].id);
        } else {
          setCurrentPageId("");
        }
      }

      return updated;
    });

    setPendingChanges(prev => {
      const updated = new Map(prev);
      
      if (id.startsWith('temp_')) {
        updated.delete(id);
      } else {
        updated.set(id, {
          type: 'deleted',
          pageId: id,
        });
      }
      
      return updated;
    });
    
    console.log('✅ Page marked for deletion:', id);
  }, [website, currentPageId]);

  const renamePage = useCallback((id: string, newName: string) => {
    const slug = newName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    console.log('✏️ Renaming page:', { id, newName });

    setPages(prev =>
      prev.map(p => p.id === id ? { ...p, name: newName, slug } : p)
    );

    setPendingChanges(prev => {
      const updated = new Map(prev);
      const existing = updated.get(id);
      
      if (existing?.type === 'created') {
        updated.set(id, {
          ...existing,
          data: { ...existing.data, name: newName, slug },
        });
      } else {
        updated.set(id, {
          type: 'renamed',
          pageId: id,
          data: { name: newName, slug },
        });
      }
      
      return updated;
    });
    
    console.log('✅ Page renamed locally');
  }, []);

// Update page content (local state only)
// Update page content (local state only)
const updatePageContent = useCallback((id: string, content: any) => {
  console.log('📝 updatePageContent called:', { 
    id, 
    contentType: typeof content,
    contentLength: typeof content === 'string' ? content.length : 'N/A',
    contentPreview: typeof content === 'string' ? content.substring(0, 100) : JSON.stringify(content).substring(0, 100)
  });
  
  // ✅ Use functional update to ensure we have latest state
  setPages((prev) => {
    const updated = prev.map((p) => {
      if (p.id === id) {
        console.log('🔄 Updating page in state:', {
          pageId: id,
          oldContentLength: typeof p.content === 'string' ? p.content.length : 'not string',
          newContentLength: typeof content === 'string' ? content.length : 'not string'
        });
        return { ...p, content, updated_at: new Date().toISOString() };
      }
      return p;
    });
    
    // Verify the update
    const updatedPage = updated.find(p => p.id === id);
    console.log('✅ Page after update in state:', {
      id: updatedPage?.id,
      contentLength: typeof updatedPage?.content === 'string' ? updatedPage.content.length : 'not string'
    });
    
    return updated;
  });

  // ✅ Also use functional update for pending changes
  setPendingChanges(prev => {
    const updated = new Map(prev);
    const existing = updated.get(id);
    
    if (existing?.type === 'created') {
      console.log('🔄 Merging content into creation for:', id);
      updated.set(id, {
        ...existing,
        data: { 
          ...existing.data, 
          content, // ✅ Store the actual content
          updated_at: new Date().toISOString()
        },
      });
    } else {
      console.log('➕ Marking page as updated:', id);
      updated.set(id, {
        type: 'updated',
        pageId: id,
        data: { content },
      });
    }
    
    return updated;
  });
}, []);
  const switchPage = useCallback((id: string) => {
    console.log('🔄 Switching to page:', id);
    setCurrentPageId(id);
  }, []);

  const setHomePage = useCallback(async (pageId: string) => {
    if (!website) return;

    try {
      console.log('🏠 Setting home page:', pageId);
      // TODO: Implement
    } catch (error) {
      console.error('Error setting home page:', error);
      throw error;
    }
  }, [website]);

  const navigateToPage = useCallback((pageId: string) => {
    const targetPage = pages.find(p => p.id === pageId);
    if (targetPage) {
      setCurrentPageId(pageId);
      
      if (isPreviewMode) {
        window.dispatchEvent(new CustomEvent('page-navigation', { 
          detail: { pageId, content: targetPage.content } 
        }));
      }
    }
  }, [pages, isPreviewMode]);

  const saveAllChanges = useCallback(async (currentEditorContent?: { pageId: string; content: any }) => {
  console.log('🚀 saveAllChanges called');
  console.log('currentEditorContent:', currentEditorContent);
  
  // ✅ Create a map of pageId -> latest content
  const latestContentMap = new Map<string, any>();
  
  // ✅ Track if we need to force save (when editor content is provided)
  let needsForceSave = false;
  
  // If current editor content is provided, add it to the map
  if (currentEditorContent) {
    console.log('📝 Capturing current editor content:', {
      pageId: currentEditorContent.pageId,
      contentLength: typeof currentEditorContent.content === 'string' ? currentEditorContent.content.length : 'N/A'
    });
    latestContentMap.set(currentEditorContent.pageId, currentEditorContent.content);
    needsForceSave = true;
    
    // Update state for UI consistency (don't wait for this)
    setPages((prev) =>
      prev.map((p) =>
        p.id === currentEditorContent.pageId
          ? { ...p, content: currentEditorContent.content, updated_at: new Date().toISOString() }
          : p
      )
    );

    // Update pending changes synchronously
    setPendingChanges(prev => {
      const updated = new Map(prev);
      const existing = updated.get(currentEditorContent.pageId);
      
      if (existing?.type === 'created') {
        console.log('🔄 Updating CREATED change with content');
        updated.set(currentEditorContent.pageId, {
          ...existing,
          data: { 
            ...existing.data, 
            content: currentEditorContent.content,
            updated_at: new Date().toISOString()
          },
        });
      } else if (!currentEditorContent.pageId.startsWith('temp_')) {
        // ✅ For existing pages, add or update the change
        console.log('➕ Adding/updating UPDATE change for existing page');
        updated.set(currentEditorContent.pageId, {
          type: 'updated',
          pageId: currentEditorContent.pageId,
          data: { content: currentEditorContent.content },
        });
      }
      
      return updated;
    });

    // ✅ Small delay to ensure React processes the state update
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // ✅ Get the current pending changes after the update
  const currentPendingChanges = new Map(pendingChanges);
  
  // If editor content was provided, make sure it's in the map
  if (currentEditorContent && !currentEditorContent.pageId.startsWith('temp_')) {
    const existing = currentPendingChanges.get(currentEditorContent.pageId);
    if (!existing || existing.type !== 'updated') {
      console.log('🔧 Force adding update change');
      currentPendingChanges.set(currentEditorContent.pageId, {
        type: 'updated',
        pageId: currentEditorContent.pageId,
        data: { content: currentEditorContent.content },
      });
    }
  }

  if (currentPendingChanges.size === 0) {
    console.log('ℹ️ No changes to save');
    return;
  }

  setIsSaving(true);
  
  try {
    const changes = Array.from(currentPendingChanges.values());
    console.log('💾 Changes to process:', changes.map(c => ({
      type: c.type,
      pageId: c.pageId,
      hasData: !!c.data
    })));

    const idMappings = new Map<string, string>();

    // STEP 1: Create all new pages
    const createdPages = changes.filter(c => c.type === 'created');
    
    for (const change of createdPages) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📄 Creating page:', change.data?.name, change.pageId);
      
      if (!change.data) {
        console.error('❌ No data for page creation');
        continue;
      }

      // Get content from latestContentMap first, then from pages state
      let contentToSave: any;
      
      if (latestContentMap.has(change.pageId)) {
        contentToSave = latestContentMap.get(change.pageId);
        console.log('✅ Using content from latestContentMap');
      } else {
        const pageInState = pages.find(p => p.id === change.pageId);
        contentToSave = pageInState?.content ?? change.data.content ?? "";
        console.log('✅ Using content from pages state or change data');
      }

      console.log('💾 Content to save:', {
        type: typeof contentToSave,
        length: typeof contentToSave === 'string' ? contentToSave.length : 'N/A',
        preview: typeof contentToSave === 'string' ? contentToSave.substring(0, 100) : String(contentToSave).substring(0, 100)
      });

      // Create the page
      const newPage = await addPageAction(
        change.data.name!,
        change.data.website_id!,
        change.data.slug!,
        contentToSave
      );
      
      console.log('✅ Page created with ID:', newPage.id);
      
      idMappings.set(change.pageId, newPage.id);
      
      setPages(prev => 
        prev.map(p => 
          p.id === change.pageId 
            ? { ...newPage, content: contentToSave } 
            : p
        )
      );
      
      if (currentPageId === change.pageId) {
        setCurrentPageId(newPage.id);
      }
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }

    // STEP 2: Process other changes
    const otherChanges = changes.filter(c => c.type !== 'created');
    
    for (const change of otherChanges) {
      const realPageId = idMappings.get(change.pageId) || change.pageId;

      if (change.type === 'updated' && idMappings.has(change.pageId)) {
        console.log('⏭️ Skipping update for newly created page');
        continue;
      }

      switch (change.type) {
        case 'updated':
          console.log('📝 Updating existing page content:', realPageId);
          
          if (!realPageId.startsWith('temp_')) {
            // Use latest content map if available, otherwise from pages state
            const contentToUpdate = latestContentMap.get(realPageId) ?? pages.find(p => p.id === realPageId)?.content;
            
            console.log('💾 Content to update:', {
              type: typeof contentToUpdate,
              length: typeof contentToUpdate === 'string' ? contentToUpdate.length : 'N/A'
            });
            
            if (contentToUpdate !== undefined) {
              await updatePageContentAction(realPageId, contentToUpdate);
              console.log('✅ Page content updated in database');
            }
          }
          break;

        case 'renamed':
          if (!realPageId.startsWith('temp_')) {
            setPages(prev =>
              prev.map(p =>
                p.id === realPageId
                  ? { ...p, name: change.data!.name!, slug: change.data!.slug! }
                  : p
              )
            );
            console.log('✅ Page renamed');
          }
          break;

        case 'deleted':
  console.log('🗑️ Deleting page:', realPageId);
  
  if (!realPageId.startsWith('temp_')) {
    await deletePageAction(realPageId); 
    console.log('✅ Page deleted from database');
  } else {
    console.log('⏭️ Skipping delete for temp page (never created)');
  }
  break;

      }
    }

    setPendingChanges(new Map());
    console.log('✅ All changes saved successfully');
    
  } catch (error) {
    console.error('❌ Error saving changes:', error);
    throw error;
  } finally {
    setIsSaving(false);
  }
}, [pendingChanges, currentPageId, pages]);
  const currentPage = pages.find((p) => p.id === currentPageId);


  console.log('context running')
  return (
    <PageContext.Provider
      value={{
        website,
        pages,
        currentPageId,
        currentPage,
        isPreviewMode,
        isLoading,
        isSaving,
        hasUnsavedChanges,
        setPages,
        addPage,
        deletePage,
        renamePage,
        switchPage,
        updatePageContent,
        saveAllChanges,
        setHasUnsavedChanges,
        // setIsPreviewMode,
        navigateToPage,
        pendingChanges,
        setHomePage,
      }}
    >
      {children}
    </PageContext.Provider>
  );
};

export const usePages = () => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error('usePages must be used within PageProvider');
  }
  return context;
};