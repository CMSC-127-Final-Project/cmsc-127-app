'use client';

import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

interface DropdownPortalProps {
  children: React.ReactNode;
  triggerRef: React.RefObject<HTMLElement>;
  isOpen: boolean;
}

const DropdownPortal: React.FC<DropdownPortalProps> = ({ children, triggerRef, isOpen }) => {
  const [styles, setStyles] = useState<React.CSSProperties>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (triggerRef.current && isOpen) {
      const rect = triggerRef.current.getBoundingClientRect();
      setStyles({
        position: 'absolute',
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        zIndex: 9999,
      });
    }
  }, [isOpen, triggerRef]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div ref={dropdownRef} style={styles}>
      {children}
    </div>,
    document.body
  );
};

export default DropdownPortal;
