
import React from 'react';
import { CarouselConfig } from '../types';

// Declaration for global libraries loaded via CDN
declare global {
  interface Window {
    html2canvas: any;
    JSZip: any;
    saveAs: any;
  }
}

export interface ExportProgress {
  current: number;
  total: number;
  status: 'preparing' | 'rendering' | 'packaging' | 'done';
}

export const downloadSlides = async (
  slideIds: string[],
  refs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>,
  onProgress?: (progress: ExportProgress) => void
) => {
  if (!window.html2canvas || !window.JSZip || !window.saveAs) {
    alert("Необходимые библиотеки (html2canvas, JSZip) еще не загружены. Пожалуйста, подождите или обновите страницу.");
    return;
  }

  const zip = new window.JSZip();
  const folder = zip.folder("instagram-carousel");
  const total = slideIds.length;

  // Initial progress
  onProgress?.({ current: 0, total, status: 'preparing' });

  // Changed to sequential processing to avoid concurrency issues with html2canvas and SVG filters
  for (let i = 0; i < slideIds.length; i++) {
    // Update progress for each slide
    onProgress?.({ current: i + 1, total, status: 'rendering' });
    const id = slideIds[i];
    const originalElement = refs.current[id];
    if (!originalElement) continue;

    let clone: HTMLElement | null = null;

    try {
      // 1. CLONE THE NODE
      clone = originalElement.cloneNode(true) as HTMLElement;
      
      // 2. RESET TRANSFORMS & POSITIONING
      clone.style.transform = 'none';
      clone.style.width = '1080px';
      clone.style.height = '1350px';
      clone.style.position = 'fixed';
      clone.style.top = '0';
      clone.style.left = '0';
      clone.style.zIndex = '-9999';
      clone.style.borderRadius = '0'; 
      
      // 3. APPEND TO BODY
      document.body.appendChild(clone);

      // --- FIX: NOISE LAYER BLEND MODE ---
      // html2canvas fails to render 'mix-blend-mode: overlay', rendering it as a gray opaque layer.
      const noiseLayer = clone.querySelector('.export-noise-layer') as HTMLElement;
      if (noiseLayer) {
        const computedStyle = window.getComputedStyle(noiseLayer);
        const originalOpacity = parseFloat(computedStyle.opacity || '0');

        noiseLayer.style.mixBlendMode = 'normal';
        // Reduce opacity to emulate overlay effect on dark background
        noiseLayer.style.opacity = (originalOpacity * 0.25).toString();
      }

      // --- FIX: POSITIONED BLOCKS ---
      // For positioned blocks mode, restore original positions from data attributes
      const positionedBlocks = clone.querySelectorAll('[data-block-id]');
      positionedBlocks.forEach((block) => {
        const el = block as HTMLElement;
        const origX = el.dataset.origX;
        const origY = el.dataset.origY;
        const origWidth = el.dataset.origWidth;
        const origHeight = el.dataset.origHeight;

        if (origX && origY && origWidth && origHeight) {
          // Reset to original 1080x1350 coordinates
          el.style.left = `${origX}px`;
          el.style.top = `${origY}px`;
          el.style.width = `${origWidth}px`;
          el.style.minHeight = `${origHeight}px`;
          el.style.transform = 'none';
          // Remove selection indicators
          el.style.boxShadow = 'none';
          el.style.outline = 'none';
        }

        // Fix font sizes (remove scale factor)
        // The font-size in positioned mode is already in original units,
        // but it was multiplied by scale (0.45) for display. We need to restore it.
        // However, our DraggableBlock uses scale=1 inside the container which is scaled,
        // so font sizes are already correct. Just ensure no transforms remain.
      });

      // Remove resize handles from clone
      const resizeHandles = clone.querySelectorAll('[data-resize-handle]');
      resizeHandles.forEach((handle) => handle.remove());

      // Remove snap grid overlay
      const snapGrid = clone.querySelector('[data-snap-grid]');
      if (snapGrid) snapGrid.remove();

      // 4. CAPTURE
      // Since we are now using divs (contentEditable), we don't need to swap textareas.
      // html2canvas captures formatted text (bold, color) inside divs automatically.
      const canvas = await window.html2canvas(clone, {
        scale: 2, 
        useCORS: true, 
        backgroundColor: null, 
        logging: false,
        allowTaint: true,
      });

      // 5. BLOB GENERATION
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b: Blob | null) => resolve(b), 'image/jpeg', 0.95);
      });

      if (blob) {
        const fileName = `slide_${(i + 1).toString().padStart(2, '0')}.jpg`;
        folder.file(fileName, blob);
      }
      
      // Small delay to allow browser to clear canvas/svg filter buffers
      await new Promise(resolve => setTimeout(resolve, 50));

    } catch (err) {
      console.error(`Error processing slide ${i + 1}:`, err);
    } finally {
      // 6. CLEAN UP
      if (clone && document.body.contains(clone)) {
        document.body.removeChild(clone);
      }
    }
  }

  // Packaging phase
  onProgress?.({ current: total, total, status: 'packaging' });

  const content = await zip.generateAsync({ type: "blob" });
  window.saveAs(content, "slidemaster-export.zip");

  // Done
  onProgress?.({ current: total, total, status: 'done' });
};

/**
 * Downloads a single slide as JPG directly (without ZIP)
 * Used for CTA slides and other single-slide exports
 */
export const downloadSingleSlide = async (
  slideRef: React.MutableRefObject<HTMLDivElement | null>,
  config: CarouselConfig,
  filename: string = 'cta-slide.jpg'
) => {
  if (!window.html2canvas || !window.saveAs) {
    alert("Необходимые библиотеки (html2canvas) еще не загружены. Пожалуйста, подождите или обновите страницу.");
    return;
  }

  const originalElement = slideRef.current;
  if (!originalElement) {
    throw new Error('Slide element not found');
  }

  let clone: HTMLElement | null = null;

  try {
    // 1. CLONE THE NODE
    clone = originalElement.cloneNode(true) as HTMLElement;

    // 2. RESET TRANSFORMS & POSITIONING
    clone.style.transform = 'none';
    clone.style.width = '1080px';
    clone.style.height = '1350px';
    clone.style.position = 'fixed';
    clone.style.top = '0';
    clone.style.left = '0';
    clone.style.zIndex = '-9999';
    clone.style.borderRadius = '0';

    // 3. APPEND TO BODY
    document.body.appendChild(clone);

    // --- FIX: NOISE LAYER BLEND MODE ---
    const noiseLayer = clone.querySelector('.export-noise-layer') as HTMLElement;
    if (noiseLayer) {
      const computedStyle = window.getComputedStyle(noiseLayer);
      const originalOpacity = parseFloat(computedStyle.opacity || '0');
      noiseLayer.style.mixBlendMode = 'normal';
      noiseLayer.style.opacity = (originalOpacity * 0.25).toString();
    }

    // 4. CAPTURE
    const canvas = await window.html2canvas(clone, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
      logging: false,
      allowTaint: true,
    });

    // 5. BLOB GENERATION
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b: Blob | null) => resolve(b), 'image/jpeg', 0.95);
    });

    if (blob) {
      window.saveAs(blob, filename);
    } else {
      throw new Error('Failed to generate image blob');
    }
  } finally {
    // 6. CLEAN UP
    if (clone && document.body.contains(clone)) {
      document.body.removeChild(clone);
    }
  }
};
