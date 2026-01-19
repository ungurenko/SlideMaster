import React, { useCallback } from 'react';

interface ResizeHandlesProps {
  scale: number;
  onResizeStart: () => void;
  onResize: (delta: { width: number; height: number }) => void;
  onResizeEnd: () => void;
}

export const ResizeHandles: React.FC<ResizeHandlesProps> = ({
  scale,
  onResizeStart,
  onResize,
  onResizeEnd,
}) => {
  const handleMouseDown = useCallback(
    (e: React.MouseEvent, corner: 'se' | 'e' | 's') => {
      e.stopPropagation();
      e.preventDefault();
      onResizeStart();

      const startX = e.clientX;
      const startY = e.clientY;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const deltaX = (moveEvent.clientX - startX) / scale;
        const deltaY = (moveEvent.clientY - startY) / scale;

        switch (corner) {
          case 'se':
            onResize({ width: deltaX, height: deltaY });
            break;
          case 'e':
            onResize({ width: deltaX, height: 0 });
            break;
          case 's':
            onResize({ width: 0, height: deltaY });
            break;
        }
      };

      const handleMouseUp = () => {
        onResizeEnd();
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [scale, onResizeStart, onResize, onResizeEnd]
  );

  const handleStyle: React.CSSProperties = {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: '#9CAF88',
    borderRadius: 2,
    zIndex: 10,
  };

  return (
    <>
      {/* SE corner (bottom-right) */}
      <div
        data-resize-handle="se"
        style={{
          ...handleStyle,
          right: -5,
          bottom: -5,
          cursor: 'se-resize',
        }}
        onMouseDown={(e) => handleMouseDown(e, 'se')}
      />
      {/* E edge (right center) */}
      <div
        data-resize-handle="e"
        style={{
          ...handleStyle,
          right: -5,
          top: '50%',
          transform: 'translateY(-50%)',
          cursor: 'e-resize',
        }}
        onMouseDown={(e) => handleMouseDown(e, 'e')}
      />
      {/* S edge (bottom center) */}
      <div
        data-resize-handle="s"
        style={{
          ...handleStyle,
          bottom: -5,
          left: '50%',
          transform: 'translateX(-50%)',
          cursor: 's-resize',
        }}
        onMouseDown={(e) => handleMouseDown(e, 's')}
      />
    </>
  );
};
