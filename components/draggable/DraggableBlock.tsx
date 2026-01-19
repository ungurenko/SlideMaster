import React, { useState, useCallback, useRef } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { TextBlock, CarouselConfig } from '../../types';
import { RichTextEditor } from '../RichTextEditor';
import { ResizeHandles } from './ResizeHandles';

interface DraggableBlockProps {
  block: TextBlock;
  scale: number;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<TextBlock>) => void;
  onDelete: () => void;
  config: CarouselConfig;
}

export const DraggableBlock: React.FC<DraggableBlockProps> = ({
  block,
  scale,
  isSelected,
  onSelect,
  onUpdate,
  config,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartSize = useRef({ width: 0, height: 0 });

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: block.id,
      data: { block },
      disabled: isResizing,
    });

  // Get styles from block or fallback to config
  const titleColor = config.titleColor || config.textColor;
  const bodyColor = config.bodyColor || config.textColor;

  const getBlockStyles = useCallback(() => {
    const baseColor = block.type === 'title' || block.type === 'subtitle'
      ? titleColor
      : bodyColor;
    const baseFont = block.type === 'title' || block.type === 'subtitle'
      ? config.titleFont
      : config.bodyFont;
    const baseFontSize = block.type === 'title'
      ? config.titleFontSize
      : block.type === 'subtitle'
      ? config.bodyFontSize
      : config.bodyFontSize;

    return {
      fontFamily: block.fontFamily || baseFont,
      fontSize: block.fontSize || baseFontSize,
      color: block.color || baseColor,
      fontWeight: block.fontWeight || (block.type === 'title' ? 900 : 400),
      textAlign: block.textAlign || 'left',
    };
  }, [block, config, titleColor, bodyColor]);

  const blockStyles = getBlockStyles();

  // Calculate position with transform
  // Positions are in canvas coordinates (1080x1350), no scaling needed
  // Transform is scaled by 1/scale to compensate for container's CSS transform: scale()
  const style: React.CSSProperties = {
    position: 'absolute',
    left: block.position.x,
    top: block.position.y,
    width: block.position.width,
    minHeight: block.position.height,
    transform: transform
      ? `translate3d(${transform.x / scale}px, ${transform.y / scale}px, 0)`
      : undefined,
    cursor: isDragging ? 'grabbing' : isResizing ? 'default' : 'grab',
    boxShadow: isSelected ? '0 0 0 2px #9CAF88' : 'none',
    outline: isDragging ? '2px dashed #9CAF88' : 'none',
    zIndex: isDragging || isSelected ? 100 : 1,
    transition: isDragging ? 'none' : 'box-shadow 0.15s ease',
  };

  const handleResizeStart = useCallback(() => {
    setIsResizing(true);
    resizeStartSize.current = {
      width: block.position.width,
      height: block.position.height,
    };
  }, [block.position]);

  const handleResize = useCallback(
    (delta: { width: number; height: number }) => {
      const newWidth = Math.max(100, resizeStartSize.current.width + delta.width);
      const newHeight = Math.max(50, resizeStartSize.current.height + delta.height);

      onUpdate({
        position: {
          ...block.position,
          width: newWidth,
          height: newHeight,
        },
      });
    },
    [block.position, onUpdate]
  );

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect();
    },
    [onSelect]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Only delete if not editing text (contentEditable not focused)
        const activeElement = document.activeElement;
        if (activeElement?.getAttribute('contenteditable') !== 'true') {
          e.preventDefault();
          // onDelete(); - commented out to prevent accidental deletion
        }
      }
    },
    []
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      data-block-id={block.id}
      data-orig-x={block.position.x}
      data-orig-y={block.position.y}
      data-orig-width={block.position.width}
      data-orig-height={block.position.height}
      {...attributes}
      {...listeners}
    >
      <RichTextEditor
        html={block.content}
        onChange={(html) => onUpdate({ content: html })}
        placeholder={
          block.type === 'title'
            ? 'ЗАГОЛОВОК'
            : block.type === 'subtitle'
            ? 'Подзаголовок'
            : 'Текст...'
        }
        configColor={blockStyles.color}
        style={{
          fontFamily: blockStyles.fontFamily,
          fontSize: `${blockStyles.fontSize}px`,
          color: blockStyles.color,
          textAlign: blockStyles.textAlign as any,
          fontWeight: blockStyles.fontWeight,
          lineHeight: block.type === 'title' ? 1.2 : 1.5,
          textTransform: block.type === 'title' ? 'uppercase' : 'none',
          textShadow:
            block.type === 'title'
              ? '0 4px 24px rgba(0,0,0,0.5)'
              : '0 2px 4px rgba(0,0,0,0.3)',
          width: '100%',
          minHeight: '100%',
        }}
      />

      {isSelected && !isDragging && (
        <ResizeHandles
          scale={scale}
          onResizeStart={handleResizeStart}
          onResize={handleResize}
          onResizeEnd={handleResizeEnd}
        />
      )}
    </div>
  );
};
