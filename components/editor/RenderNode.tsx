// components/editor/RenderNode.tsx
import { useNode, useEditor } from '@craftjs/core';
import { ROOT_NODE } from '@craftjs/utils';
import React, { useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

import { ArrowUp, Move, Trash2 } from 'lucide-react';

const IndicatorDiv = styled.div`
  height: 30px;
  margin-top: -29px;
  font-size: 12px;
  line-height: 12px;
  display: flex;
  align-items: center;
  padding: 0 8px;
  gap: 4px;

  svg {
    fill: #fff;
    width: 15px;
    height: 15px;
  }
`;

const Btn = styled.a`
  padding: 0 0px;
  opacity: 0.9;
  display: flex;
  align-items: center;
  cursor: pointer;
  > div {
    position: relative;
    top: -50%;
    left: -50%;
  }
`;

// ✅ Helper function to determine border color based on element type and depth
const getBorderConfig = (isRoot: boolean, displayName: string, depth: number) => {
  // Root container (App) - Green border
  if (isRoot) {
    return {
      color: '#22c55e', // green-500
      width: '3px',
      style: 'solid'
    };
  }
  
  // Container elements - Orange border
  if (displayName === 'Container') {
    return {
      color: '#f97316', // orange-500
      width: '2px',
      style: 'solid'
    };
  }
  
  // All other elements (Text, Button, etc.) - Blue border
  return {
    color: '#3b82f6', // blue-500
    width: '2px',
    style: 'solid'
  };
};

export const RenderNode = ({ render }: any) => {
  const { id } = useNode();
  const { actions, query, isActive } = useEditor((_, query) => ({
    isActive: query.getEvent('selected').contains(id),
  }));

  const {
    isHover,
    dom,
    name,
    moveable,
    deletable,
    connectors: { drag },
    parent,
  } = useNode((node) => ({
    isHover: node.events.hovered,
    dom: node.dom,
    name: node.data.custom.displayName || node.data.displayName,
    moveable: query.node(node.id).isDraggable(),
    deletable: query.node(node.id).isDeletable(),
    parent: node.data.parent,
    props: node.data.props,
  }));

  const currentRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (dom) {
      if (isActive || isHover) {
        const borderConfig = getBorderConfig(id === ROOT_NODE, name, 0);
        dom.style.border = `${borderConfig.width} ${borderConfig.style} ${borderConfig.color}`;
      } else {
        dom.style.border = '';
      }
    }
  }, [isActive, isHover, dom, id, name]);

  const getPos = useCallback((dom: HTMLElement) => {
    const { top, left, bottom } = dom
      ? dom.getBoundingClientRect()
      : { top: 0, left: 0, bottom: 0 };
    return {
      top: `${top > 0 ? top : bottom}px`,
      left: `${left}px`,
    };
  }, []);

  const scroll = useCallback(() => {
    const { current: currentDOM } = currentRef;

    if (!currentDOM) return;
    const { top, left } = getPos(dom as HTMLElement);
    currentDOM.style.top = top;
    currentDOM.style.left = left;
  }, [dom, getPos]);

  useEffect(() => {
    const renderer = document.querySelector('.craftjs-renderer');
    if (renderer) {
      renderer.addEventListener('scroll', scroll);
    }

    return () => {
      if (renderer) {
        renderer.removeEventListener('scroll', scroll);
      }
    };
  }, [scroll]);

  const borderConfig = getBorderConfig(id === ROOT_NODE, name, 0);

  return (
    <>
      {(isHover || isActive) &&
        ReactDOM.createPortal(
          <IndicatorDiv
            ref={currentRef as any}
            className="fixed flex items-center px-2 text-white text-xs"
            style={{
              left: getPos(dom as HTMLElement).left,
              top: getPos(dom as HTMLElement).top,
              zIndex: 9999,
              backgroundColor: borderConfig.color,
            }}
          >
            <span className="flex-1">{name}</span>
            {moveable ? (
              <Btn
                className="cursor-move mr-2"
                ref={drag as any}
                onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
              >
                <Move className="w-4 h-4" />
              </Btn>
            ) : null}
            {id !== ROOT_NODE && (
              <Btn
                className="cursor-pointer mr-2"
                onMouseDown={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  actions.selectNode(parent as string);
                }}
              >
                <ArrowUp className="w-4 h-4" />
              </Btn>
            )}
            {deletable ? (
              <Btn
                className="cursor-pointer"
                onMouseDown={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  actions.delete(id);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Btn>
            ) : null}
          </IndicatorDiv>,
          document.querySelector('.page-container') as Element
        )}
      {render}
    </>
  );
};