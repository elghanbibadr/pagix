import { Button } from '@/components/ui/button';
import { useEditor } from '@craftjs/core';
import { Tooltip } from '@mui/material';
import cx from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { styled } from 'styled-components';

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
  const { query } = useEditor();

  const { enabled, canUndo, canRedo, actions } = useEditor((state, query) => ({
    enabled: state.options.enabled,
    canUndo: query.history.canUndo(),
    canRedo: query.history.canRedo(),
  }));

  const handlePreview = () => {
    const json = query.serialize();
    
    // Create a blob URL with the preview HTML
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
    // Preview content will be rendered here
    const data = ${JSON.stringify(json)};
    console.log('Preview data:', data);
    
    // Display a simple representation
    document.getElementById('root').innerHTML = '<div style="padding: 2rem;"><pre>' + JSON.stringify(data, null, 2) + '</pre></div>';
  </script>
</body>
</html>
    `;
    
    // Open in new window
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(previewHTML);
      previewWindow.document.close();
    }
  };

  return (
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
        <div className="flex gap-2">
          <Btn
            className={cx([
              'transition cursor-pointer',
              {
                'bg-green-400': enabled,
                'bg-primary': !enabled,
              },
            ])}
            onClick={() => {
              actions.setOptions((options) => (options.enabled = !enabled));
            }}
          >
            {enabled ? (
              <Image
                src="/icons/check.svg"
                alt="Checkmark"
                width={12}
                height={12}
              />
            ) : (
              <Image
                src="/icons/customize.svg"
                alt="Customize"
                width={12}
                height={12}
              />
            )}
            {enabled ? 'Finish Editing' : 'Edit'}
          </Btn>
          <Btn onClick={handlePreview} className='bg-black cursor-pointer text-white'>Preview</Btn>
          <Link href="/dashboard"><Button> Go back </Button></Link> 
        </div>
      </div>
    </HeaderDiv>
  );
};