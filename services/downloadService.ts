
import React from 'react';

// Declaration for global libraries loaded via CDN
declare global {
  interface Window {
    html2canvas: any;
    JSZip: any;
    saveAs: any;
  }
}

export const downloadSlides = async (slideIds: string[], refs: React.MutableRefObject<{ [key: string]: HTMLDivElement | null }>) => {
  if (!window.html2canvas || !window.JSZip || !window.saveAs) {
    alert("Необходимые библиотеки (html2canvas, JSZip) еще не загружены. Пожалуйста, подождите или обновите страницу.");
    return;
  }

  const zip = new window.JSZip();
  const folder = zip.folder("instagram-carousel");

  const promises = slideIds.map(async (id, index) => {
    const originalElement = refs.current[id];
    if (!originalElement) return;

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
        const fileName = `slide_${(index + 1).toString().padStart(2, '0')}.jpg`;
        folder.file(fileName, blob);
      }
    } catch (err) {
      console.error(`Error processing slide ${index + 1}:`, err);
    } finally {
      // 6. CLEAN UP
      if (clone && document.body.contains(clone)) {
        document.body.removeChild(clone);
      }
    }
  });

  await Promise.all(promises);

  const content = await zip.generateAsync({ type: "blob" });
  window.saveAs(content, "slidemaster-export.zip");
};
