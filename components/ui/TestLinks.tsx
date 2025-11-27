// components/TestLinks.tsx
'use client';

import React from 'react';
import { Element } from '@craftjs/core';
import { Container, Text } from '@/components/selectors';
import { Link } from '@/components/selectors/Link';
import { ButtonLink } from '@/components/selectors/ButtonLink';

export const TestLinks = () => {
  return (
    <Element
      canvas
      is={Container}
      width="100%"
      height="auto"
      background={{ r: 240, g: 240, b: 240, a: 1 }}
      padding={['40', '40', '40', '40']}
      custom={{ displayName: 'Test Links Section' }}
    >
      <Text fontSize="28" fontWeight="600" text="Test Navigation Links" margin={['0', '0', '20', '0']} />
      
      <Element
        canvas
        is={Container}
        width="100%"
        height="auto"
        flexDirection="column"
        padding={['20', '20', '20', '20']}
        custom={{ displayName: 'Links Container' }}
      >
        {/* Text Links */}
        <Text fontSize="18" fontWeight="500" text="Text Links:" margin={['0', '0', '10', '0']} />
        <Link text="Go to Home Page" linkType="internal" targetPageId="page-1" margin={['5', '0', '5', '0']} />
        <Link text="Go to About Page" linkType="internal" targetPageId="page-2" margin={['5', '0', '5', '0']} />
        <Link text="Go to Contact Page" linkType="internal" targetPageId="page-3" margin={['5', '0', '20', '0']} />
        
        {/* Button Links */}
        <Text fontSize="18" fontWeight="500" text="Button Links:" margin={['20', '0', '10', '0']} />
        <ButtonLink text="Home" linkType="internal" targetPageId="page-1" margin={['5', '0', '5', '0']} />
        <ButtonLink text="About" linkType="internal" targetPageId="page-2" margin={['5', '0', '5', '0']} />
        <ButtonLink text="Contact" linkType="internal" targetPageId="page-3" margin={['5', '0', '5', '0']} />
        
        {/* External Link */}
        <Text fontSize="18" fontWeight="500" text="External Link:" margin={['20', '0', '10', '0']} />
        <Link 
          text="Visit Google" 
          linkType="external" 
          href="https://google.com" 
          openInNewTab={true}
          margin={['5', '0', '5', '0']} 
        />
      </Element>
    </Element>
  );
};