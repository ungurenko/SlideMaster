import React from 'react';

interface SnapGuidesProps {
  gridSize: number;
  scale: number;
}

export const SnapGuides: React.FC<SnapGuidesProps> = ({ gridSize, scale }) => {
  const scaledGrid = gridSize * scale;

  return (
    <div
      className="absolute inset-0 pointer-events-none z-10"
      data-snap-grid="true"
    >
      <svg width="100%" height="100%" className="opacity-20">
        <defs>
          <pattern
            id="snap-grid-pattern"
            width={scaledGrid}
            height={scaledGrid}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${scaledGrid} 0 L 0 0 0 ${scaledGrid}`}
              fill="none"
              stroke="#9CAF88"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#snap-grid-pattern)" />
      </svg>
    </div>
  );
};
