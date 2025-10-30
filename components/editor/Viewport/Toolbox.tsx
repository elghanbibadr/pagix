import { Element, useEditor } from '@craftjs/core';
import { Tooltip } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import { styled } from 'styled-components';

import { Button } from '../../selectors/Button';
import { Container } from '../../selectors/Container';
import { Text } from '../../selectors/Text';
import { Video } from '../../selectors/Video';

const ToolboxDiv = styled.div<{ $enabled: boolean }>`
  transition: 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  ${(props) => (!props.$enabled ? `width: 0;` : '')}
  ${(props) => (!props.$enabled ? `opacity: 0;` : '')}
`;

const Item = styled.a<{ $move?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  img {
    width: 28px;
    height: 28px;
    filter: invert(44%) sepia(0%) saturate(0%) hue-rotate(180deg) brightness(96%) contrast(92%);
  }
  ${(props) =>
    props.$move &&
    `
    cursor: move;
  `}
`;

export const Toolbox = () => {
  const {
    enabled,
    connectors: { create },
  } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  return (
    <ToolboxDiv
      $enabled={enabled && enabled}
      className="toolbox transition w-12 h-full flex flex-col bg-white"
    >
      <div className="flex flex-1 flex-col items-center pt-3 gap-3">
        <div
          ref={(ref) => {
            create(
              ref,
              <Element
                canvas
                is={Container}
                background={{ r: 78, g: 78, b: 78, a: 1 }}
                color={{ r: 0, g: 0, b: 0, a: 1 }}
                height="300px"
                width="300px"
              ></Element>
            );
          }}
        >
          <Tooltip title="Container" placement="right">
            <Item $move>
              <Image
                src="/icons/toolbox/rectangle.svg"
                alt="Container"
                width={28}
                height={28}
              />
            </Item>
          </Tooltip>
        </div>
        <div
          ref={(ref) => {
            create(
              ref,
              <Text fontSize="12" textAlign="left" text="Hi there" />
            );
          }}
        >
          <Tooltip title="Text" placement="right">
            <Item $move>
              <Image
                src="/icons/toolbox/text.svg"
                alt="Text"
                width={28}
                height={28}
              />
            </Item>
          </Tooltip>
        </div>
        <div
          ref={(ref) => {
            create(ref, <Button />);
          }}
        >
          <Tooltip title="Button" placement="right">
            <Item $move>
              <Image
                src="/icons/toolbox/button.svg"
                alt="Button"
                width={28}
                height={28}
              />
            </Item>
          </Tooltip>
        </div>
        <div
          ref={(ref) => {
            create(ref, <Video />);
          }}
        >
          <Tooltip title="Video" placement="right">
            <Item $move>
              <Image
                src="/icons/toolbox/video-line.svg"
                alt="Video"
                width={28}
                height={28}
              />
            </Item>
          </Tooltip>
        </div>
      </div>
    </ToolboxDiv>
  );
};