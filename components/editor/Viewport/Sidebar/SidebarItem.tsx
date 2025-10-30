import classNames from 'classnames';
import Image from 'next/image';
import React from 'react';
import { styled } from 'styled-components';

const SidebarItemDiv = styled.div<{ $visible?: boolean; $height?: string }>`
  height: ${(props) =>
    props.$visible && props.$height && props.$height !== 'full'
      ? `${props.$height}`
      : 'auto'};
  flex: ${(props) =>
    props.$visible && props.$height && props.$height === 'full'
      ? `1`
      : 'unset'};
  color: #545454;
  border-bottom: 1px solid transparent;
  border-color: ${(props) => (props.$visible ? '#eee' : 'transparent')};
`;

const Chevron = styled.a<{ $visible: boolean }>`
  transform: rotate(${(props) => (props.$visible ? 180 : 0)}deg);
  img {
    width: 10px;
    height: 10px;
  }
`;

export type SidebarItemProps = {
  title: string;
  height?: string;
  icon: string;
  visible?: boolean;
  onChange?: (bool: boolean) => void;
  children?: React.ReactNode;
  className?: string;
};

const HeaderDiv = styled.div`
  color: #615c5c;
  height: 45px;
  img {
    filter: invert(44%) sepia(0%) saturate(0%) hue-rotate(180deg) brightness(96%) contrast(92%);
  }
`;

export const SidebarItem: React.FC<SidebarItemProps> = ({
  visible,
  icon,
  title,
  children,
  height,
  onChange,
  className,
}) => {
  return (
    <SidebarItemDiv
      $visible={visible}
      $height={height}
      className={classNames('flex flex-col', className)}
    >
      <HeaderDiv
        onClick={() => {
          if (onChange) onChange(!visible);
        }}
        className={`cursor-pointer bg-white border-b last:border-b-0 flex items-center px-2 ${
          visible ? 'shadow-sm' : ''
        }`}
      >
        <div className="flex-1 flex items-center">
          <Image
            src={icon}
            alt={title}
            width={16}
            height={16}
            className="mr-2"
          />
          <h2 className="text-xs uppercase">{title}</h2>
        </div>
        <Chevron $visible={visible}>
          <Image
            src="/icons/arrow.svg"
            alt="Arrow"
            width={10}
            height={10}
          />
        </Chevron>
      </HeaderDiv>
      {visible ? (
        <div className="w-full flex-1 overflow-auto">{children}</div>
      ) : null}
    </SidebarItemDiv>
  );
};