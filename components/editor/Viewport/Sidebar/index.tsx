// components/editor/Sidebar/index.tsx
import { useEditor } from '@craftjs/core';
import { Layers } from '@craftjs/layers';
import React, { useState } from 'react';
import { styled } from 'styled-components';

import { SidebarItem } from './SidebarItem';

import CustomizeIcon from '@/public/icons/customize.svg';
import LayerIcon from '@/public/icons/layers.svg';
import { Toolbar } from '../../Toolbar';
import { PageNavigationPanel } from '@/components/navigation-pages-pannel';

export const SidebarDiv = styled.div<{ $enabled: boolean }>`
  width: 280px;
  opacity: ${(props) => (props.$enabled ? 1 : 0)};
  background: #fff;
  margin-right: ${(props) => (props.$enabled ? 0 : -280)}px;
`;

export const Sidebar = () => {
  const [layersVisible, setLayerVisible] = useState(true);
  const [toolbarVisible, setToolbarVisible] = useState(true);
  const [pagesVisible, setPagesVisible] = useState(true);
  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  return (
    <SidebarDiv $enabled={enabled} className="sidebar transition bg-white w-2">
      <div className="flex flex-col h-full">
        <SidebarItem
          icon={CustomizeIcon}
          title="Customize"
          height={!layersVisible && !pagesVisible ? 'full' : '40%'}
          visible={toolbarVisible}
          onChange={(val) => setToolbarVisible(val)}
          className="overflow-auto"
        >
          <Toolbar />
        </SidebarItem>
        
        <SidebarItem
          icon={LayerIcon}
          title="Pages"
          height={!toolbarVisible && !layersVisible ? 'full' : '30%'}
          visible={pagesVisible}
          onChange={(val) => setPagesVisible(val)}
        >
          <PageNavigationPanel />
        </SidebarItem>

        <SidebarItem
          icon={LayerIcon}
          title="Layers"
          height={!toolbarVisible && !pagesVisible ? 'full' : '30%'}
          visible={layersVisible}
          onChange={(val) => setLayerVisible(val)}
        >
          <div className="">
            <Layers expandRootOnLoad={true} />
          </div>
        </SidebarItem>
      </div>
    </SidebarDiv>
  );
};