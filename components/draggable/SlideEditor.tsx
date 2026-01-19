import React, { useState, useCallback } from 'react';
import {
  DndContext,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';
import { createSnapModifier } from '@dnd-kit/modifiers';
import { SlideData, TextBlock, CarouselConfig } from '../../types';
import { DraggableBlock } from './DraggableBlock';
import { SnapGuides } from './SnapGuides';

// Noise texture SVG (same as SlideCanvas)
const NOISE_SVG_DATA_URI =
  "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E";

interface SlideEditorProps {
  slide: SlideData;
  config: CarouselConfig;
  scale: number;
  onUpdateBlocks: (blocks: TextBlock[]) => void;
  forwardedRef?: React.Ref<HTMLDivElement>;
}

const GRID_SIZE = 20; // 20px snap grid
const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1350;

export const SlideEditor: React.FC<SlideEditorProps> = ({
  slide,
  config,
  scale,
  onUpdateBlocks,
  forwardedRef,
}) => {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(false);

  // Create snap modifier
  const snapToGrid = createSnapModifier(GRID_SIZE * scale);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px movement before drag starts
      },
    })
  );

  const handleDragStart = useCallback(() => {
    setShowGrid(true);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setShowGrid(false);
      const { active, delta } = event;
      const blockId = active.id as string;

      const blocks = slide.blocks || [];
      const updatedBlocks = blocks.map((block) => {
        if (block.id === blockId) {
          // delta is already snapped by the modifier, just convert to canvas coordinates
          // Round to avoid floating point precision issues
          const rawX = block.position.x + delta.x / scale;
          const rawY = block.position.y + delta.y / scale;

          // Bounds checking
          const newX = Math.max(
            0,
            Math.min(CANVAS_WIDTH - block.position.width, Math.round(rawX))
          );
          const newY = Math.max(
            0,
            Math.min(CANVAS_HEIGHT - block.position.height, Math.round(rawY))
          );

          return {
            ...block,
            position: {
              ...block.position,
              x: newX,
              y: newY,
            },
          };
        }
        return block;
      });

      onUpdateBlocks(updatedBlocks);
    },
    [slide.blocks, scale, onUpdateBlocks]
  );

  const handleBlockUpdate = useCallback(
    (blockId: string, updates: Partial<TextBlock>) => {
      const blocks = slide.blocks || [];
      const updatedBlocks = blocks.map((block) =>
        block.id === blockId ? { ...block, ...updates } : block
      );
      onUpdateBlocks(updatedBlocks);
    },
    [slide.blocks, onUpdateBlocks]
  );

  const handleBlockDelete = useCallback(
    (blockId: string) => {
      const blocks = slide.blocks || [];
      onUpdateBlocks(blocks.filter((b) => b.id !== blockId));
      setSelectedBlockId(null);
    },
    [slide.blocks, onUpdateBlocks]
  );

  const handleCanvasClick = useCallback(() => {
    setSelectedBlockId(null);
  }, []);

  // Container and canvas styles
  const wrapperStyle: React.CSSProperties = {
    width: `${CANVAS_WIDTH * scale}px`,
    height: `${CANVAS_HEIGHT * scale}px`,
  };

  const containerStyle: React.CSSProperties = {
    width: `${CANVAS_WIDTH}px`,
    height: `${CANVAS_HEIGHT}px`,
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    backgroundColor: '#1a1816',
  };

  return (
    <DndContext
      sensors={sensors}
      modifiers={[snapToGrid]}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        style={wrapperStyle}
        className="relative overflow-hidden shadow-lg rounded-sm ring-1 ring-black/5"
      >
        <div
          ref={forwardedRef}
          style={containerStyle}
          className="relative flex flex-col overflow-hidden"
          onClick={handleCanvasClick}
        >
          {/* Background Image Layer */}
          {config.backgroundImage && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${config.backgroundImage})`,
              }}
            />
          )}

          {/* Non-Cover Styling Layers (Dark Overlay) */}
          {!slide.isCover && (
            <div
              className="absolute inset-0 bg-[#0F0E0D] transition-colors duration-300"
              style={{ opacity: config.overlayOpacity / 100 }}
            />
          )}

          {/* Noise Texture (Only on non-cover slides) */}
          {!slide.isCover && (
            <div
              className="absolute inset-0 pointer-events-none mix-blend-overlay export-noise-layer"
              style={{
                backgroundImage: `url("${NOISE_SVG_DATA_URI}")`,
                opacity: config.noiseOpacity / 100,
              }}
            />
          )}

          {/* Cover Overlay (depends on coverTextPosition) */}
          {slide.isCover && config.coverTextPosition === 'center' && (
            <div className="absolute inset-0 bg-black/40 pointer-events-none" />
          )}
          {slide.isCover && config.coverTextPosition !== 'center' && (
            <div className="absolute bottom-0 left-0 w-full h-[60%] bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
          )}

          {/* Grid overlay (visible during drag) */}
          {showGrid && <SnapGuides gridSize={GRID_SIZE} scale={1} />}

          {/* Draggable blocks */}
          <div className="relative z-20 w-full h-full">
            {slide.blocks?.map((block) => (
              <DraggableBlock
                key={block.id}
                block={block}
                scale={scale} // Pass container scale to compensate for CSS transform
                isSelected={selectedBlockId === block.id}
                onSelect={() => setSelectedBlockId(block.id)}
                onUpdate={(updates) => handleBlockUpdate(block.id, updates)}
                onDelete={() => handleBlockDelete(block.id)}
                config={config}
              />
            ))}
          </div>

          {/* Navigation Arrow (only for content slides) */}
          {!slide.isCover && (
            <div className="absolute bottom-[40px] right-[40px] opacity-80 z-10 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke={config.bodyColor || config.textColor}
                className="w-12 h-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </DndContext>
  );
};
