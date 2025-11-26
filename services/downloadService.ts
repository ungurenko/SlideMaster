
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
      // We find the noise layer and drastically reduce its opacity to emulate the texture 
      // without washing out the colors.
      const noiseLayer = clone.querySelector('.export-noise-layer') as HTMLElement;
      if (noiseLayer) {
        // Get the original opacity set by the user
        const computedStyle = window.getComputedStyle(noiseLayer);
        const originalOpacity = parseFloat(computedStyle.opacity || '0');
        
        // Force blend mode to normal (as html2canvas will do anyway)
        noiseLayer.style.mixBlendMode = 'normal';
        
        // Reduce opacity to 25% of the original. 
        // e.g., 50% Overlay ~= 12.5% Normal gray on top of dark bg.
        // This heuristic keeps the grain visible but stops it from turning the image gray.
        noiseLayer.style.opacity = (originalOpacity * 0.25).toString();
      }
      // -----------------------------------

      // 4. CONVERT TEXTAREAS TO DIVS
      // We must copy the value directly from the original element because cloneNode
      // does not copy the current 'value' of textareas if changed by user.
      const originalTextareas = originalElement.querySelectorAll('textarea');
      const clonedTextareas = clone.querySelectorAll('textarea');

      originalTextareas.forEach((source, i) => {
        const target = clonedTextareas[i];
        if (!target) return;

        const div = document.createElement('div');
        const computedStyle = window.getComputedStyle(source); 

        // Copy Styles
        div.style.width = '100%';
        div.style.height = source.style.height || `${source.scrollHeight}px`; 
        div.style.fontFamily = computedStyle.fontFamily;
        div.style.fontSize = computedStyle.fontSize;
        div.style.fontWeight = computedStyle.fontWeight;
        div.style.lineHeight = computedStyle.lineHeight;
        div.style.color = computedStyle.color;
        div.style.textAlign = computedStyle.textAlign;
        div.style.textTransform = computedStyle.textTransform;
        div.style.textShadow = computedStyle.textShadow;
        div.style.letterSpacing = computedStyle.letterSpacing;
        div.style.whiteSpace = 'pre-wrap'; 
        div.style.wordBreak = 'break-word';
        div.style.padding = computedStyle.padding;
        div.style.boxSizing = computedStyle.boxSizing;
        
        div.style.display = 'flex';
        div.style.flexDirection = 'column';
        div.style.justifyContent = 'center'; 

        // Copy Content (CRITICAL: Use value from source, not innerHTML from clone)
        div.textContent = source.value;

        target.parentNode?.replaceChild(div, target);
      });

      // 5. CAPTURE
      const canvas = await window.html2canvas(clone, {
        scale: 2, 
        useCORS: true, 
        backgroundColor: null, 
        logging: false,
        allowTaint: true,
      });

      // 6. BLOB GENERATION
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
      // 7. CLEAN UP
      if (clone && document.body.contains(clone)) {
        document.body.removeChild(clone);
      }
    }
  });

  await Promise.all(promises);

  const content = await zip.generateAsync({ type: "blob" });
  window.saveAs(content, "slidemaster-export.zip");
};
