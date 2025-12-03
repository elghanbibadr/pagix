import { Button } from '@/components/ui/button';
import { useEditor } from '@craftjs/core';
import { Tooltip } from '@mui/material';
import cx from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { styled } from 'styled-components';
import { usePages } from '@/contexts/PageContext';
import { useRouter } from 'next/navigation';
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

const HeaderDiv = styled.div`
  width: 100%;
  height: 45px;
  z-index: 99999;
  position: relative;
  padding: 0px 10px;
  background: #d4d4d4;
  display: flex;
`;

const Btn = styled.a`
  display: flex;
  align-items: center;
  padding: 5px 15px;
  border-radius: 3px;
  color: #fff;
  font-size: 13px;
  img {
    margin-right: 6px;
    width: 12px;
    height: 12px;
    filter: brightness(0) invert(1);
    opacity: 0.9;
  }
`;

const Item = styled.a<{ disabled?: boolean }>`
  margin-right: 10px;
  cursor: pointer;
  img {
    width: 20px;
    height: 20px;
    filter: invert(44%) sepia(0%) saturate(0%) hue-rotate(180deg) brightness(96%) contrast(92%);
  }
  ${(props) =>
    props.disabled &&
    `
    opacity:0.5;
    cursor: not-allowed;
  `}
`;

export const Header = () => {
  const { query, actions } = useEditor();
  const { saveAllChanges, hasUnsavedChanges, isSaving, currentPageId,pendingChanges } = usePages();
  const router = useRouter();
  const [showExitDialog, setShowExitDialog] = useState(false);

  const { enabled, canUndo, canRedo } = useEditor((state, query) => ({
    enabled: state.options.enabled,
    canUndo: query.history.canUndo(),
    canRedo: query.history.canRedo(),
  }));

  const handleSave = async () => {
    try {
      console.log('💾 Save button clicked');
      
      // Get the current editor state
      const json = query.serialize();
      
      console.log('📝 Editor content:', {
        type: typeof json,
        length: typeof json === 'string' ? json.length : 'N/A',
        currentPageId
      });
      
      // Pass content directly to saveAllChanges
      await saveAllChanges({
        pageId: currentPageId,
        content: json
      });
      
      console.log('✅ Changes saved successfully');
    } catch (error) {
      console.error('❌ Failed to save changes:', error);
      alert('Failed to save changes. Please try again.');
    }
  };

  const handleFinishEditing = () => {
    if (hasUnsavedChanges) {
      const confirmLeave = confirm('You have unsaved changes. Do you want to continue without saving?');
      if (!confirmLeave) return;
    }
    
    actions.setOptions((options) => (options.enabled = !enabled));
  };

  const handleBackToDashboard = () => {
    console.log('pending changes',pendingChanges)
    if (hasUnsavedChanges) {
      setShowExitDialog(true);
    } else {
      router.push('/dashboard');
    }
  };

  const handleSaveAndExit = async () => {
    try {
      // Get the current editor state
      const json = query.serialize();
      
      // Save changes
      await saveAllChanges({
        pageId: currentPageId,
        content: json
      });
      
      // Navigate to dashboard after successful save
      router.push('/dashboard');
    } catch (error) {
      console.error('❌ Failed to save changes:', error);
      alert('Failed to save changes. Please try again.');
      setShowExitDialog(false);
    }
  };

  const handleExitWithoutSaving = () => {
    router.push('/dashboard');
  };

  const handlePreview = () => {
    const json = query.serialize();
    
    const previewHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { margin: 0; padding: 0; }
    .preview-header {
      background: #1f2937;
      color: white;
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  </style>
</head>
<body>
  <div class="preview-header">
    <h1 style="margin: 0; font-size: 1.25rem; font-weight: 600;">Preview Mode</h1>
    <button onclick="window.close()" style="background: white; color: #1f2937; padding: 0.5rem 1rem; border-radius: 0.25rem; border: none; cursor: pointer; font-weight: 500;">
      Close Preview
    </button>
  </div>
  <div id="root"></div>
  <script type="module">
    const data = ${JSON.stringify(json)};
    console.log('Preview data:', data);
    document.getElementById('root').innerHTML = '<div style="padding: 2rem;"><pre>' + JSON.stringify(data, null, 2) + '</pre></div>';
  </script>
</body>
</html>
    `;
    
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(previewHTML);
      previewWindow.document.close();
    }
  };

  console.log('has un',hasUnsavedChanges)

  return (
    <>
      <HeaderDiv className="header text-white transition w-full">
        <div className="items-center flex w-full px-4 justify-end">
          {enabled && (
            <div className="flex-1 flex">
              <Tooltip title="Undo" placement="bottom">
                <Item disabled={!canUndo} onClick={() => actions.history.undo()}>
                  <Image
                    src="/icons/toolbox/undo.svg"
                    alt="Undo"
                    width={20}
                    height={20}
                  />
                </Item>
              </Tooltip>
              <Tooltip title="Redo" placement="bottom">
                <Item disabled={!canRedo} onClick={() => actions.history.redo()}>
                  <Image
                    src="/icons/toolbox/redo.svg"
                    alt="Redo"
                    width={20}
                    height={20}
                  />
                </Item>
              </Tooltip>
            </div>
          )}
          <div className="flex gap-2 items-center">
            {/* Show unsaved changes indicator only from context */}
            {hasUnsavedChanges && (
              <span className="text-orange-600 text-sm font-medium flex items-center gap-1">
                <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></span>
                Unsaved changes
              </span>
            )}
            
            {/* Save Button - Always available when editing */}
            {enabled && (
              <Btn
                className="transition cursor-pointer bg-blue-500"
                onClick={handleSave}
                style={{ 
                  opacity: isSaving ? 0.6 : 1,
                  pointerEvents: isSaving ? 'none' : 'auto'
                }}
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin h-3 w-3 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <Image
                      src="/icons/check.svg"
                      alt="Save"
                      width={12}
                      height={12}
                    />
                    Save
                  </>
                )}
              </Btn>
            )}
            
            {/* Finish Editing / Edit Button */}
            <Btn
              className={cx([
                'transition cursor-pointer',
                {
                  'bg-green-400': enabled,
                  'bg-primary': !enabled,
                },
              ])}
              onClick={handleFinishEditing}
            >
              {enabled ? (
                <>
                  <Image
                    src="/icons/customize.svg"
                    alt="Finish"
                    width={12}
                    height={12}
                  />
                  Finish Editing
                </>
              ) : (
                <>
                  <Image
                    src="/icons/customize.svg"
                    alt="Customize"
                    width={12}
                    height={12}
                  />
                  Edit
                </>
              )}
            </Btn>
            
            <Btn onClick={handlePreview} className='bg-black cursor-pointer text-white'>
              Preview
            </Btn>
            
            {/* Back to Dashboard Button */}
            <Button onClick={handleBackToDashboard} variant="outline">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </HeaderDiv>

      {/* Unsaved Changes Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>You have unsaved changes</AlertDialogTitle>
            <AlertDialogDescription>
              Would you like to save before exiting?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowExitDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleExitWithoutSaving}
              className="bg-gray-500 hover:bg-gray-600"
            >
              Exit Without Saving
            </AlertDialogAction>
            <AlertDialogAction 
              onClick={handleSaveAndExit}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Save & Exit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};