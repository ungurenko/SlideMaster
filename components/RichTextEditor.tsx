
import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface RichTextEditorProps {
  html: string;
  onChange: (html: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
  className?: string;
  configColor?: string; // Current theme accent/title color to offer as quick pick
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  html,
  onChange,
  placeholder,
  style,
  className,
  configColor
}) => {
  const contentEditableRef = useRef<HTMLDivElement>(null);
  const [toolbarPosition, setToolbarPosition] = useState<{ top: number; left: number } | null>(null);
  const [showToolbar, setShowToolbar] = useState(false);

  // Sync internal HTML with prop if it changes externally
  // CRITICAL FIX: We removed dangerouslySetInnerHTML to prevent React from re-rendering the DOM on every keystroke,
  // which causes the cursor to jump to the start. We now manage innerHTML manually via refs.
  useEffect(() => {
    const el = contentEditableRef.current;
    if (!el) return;

    // Check if the element is currently focused (user is typing/editing)
    const isFocused = document.activeElement === el;
    
    // Logic:
    // 1. If NOT focused, always sync (handles slide switching, undo/redo, presets).
    // 2. If focused, DO NOT sync (trust the browser's DOM state to keep cursor position).
    // 3. Exception: If the content is empty (initial render), sync regardless of focus to show text.
    if (!isFocused || (el.innerHTML === '' && html)) {
       if (el.innerHTML !== html) {
          el.innerHTML = html;
       }
    }
  }, [html]);

  // Handle Text Selection
  const handleSelect = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setShowToolbar(false);
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // Ensure selection is inside this editor
    if (contentEditableRef.current && !contentEditableRef.current.contains(selection.anchorNode)) {
        setShowToolbar(false);
        return;
    }

    // Show toolbar above the selection
    // We use fixed positioning relative to viewport
    setToolbarPosition({
      top: rect.top - 50, // 50px above selection
      left: rect.left + rect.width / 2 // Centered
    });
    setShowToolbar(true);
  };

  const handleChange = () => {
    if (contentEditableRef.current) {
      onChange(contentEditableRef.current.innerHTML);
    }
  };

  // SYSTEMIC FIX: Intercept paste to strip styles (Google Docs, etc.)
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    // Get plain text from clipboard
    const text = e.clipboardData.getData('text/plain');
    // Insert text at cursor position. This removes all external HTML/CSS styles.
    document.execCommand('insertText', false, text);
  };

  // Commands
  const toggleBold = (e: React.MouseEvent) => {
    e.preventDefault();
    document.execCommand('bold', false);
    updateToolbarState(); 
  };

  const applyColor = (e: React.MouseEvent, color: string) => {
    e.preventDefault();
    document.execCommand('foreColor', false, color);
    setShowToolbar(false); 
    handleChange();
  };

  // Keep toolbar visible and updated if we click bold (selection stays)
  const updateToolbarState = () => {
    if (contentEditableRef.current) {
        onChange(contentEditableRef.current.innerHTML);
    }
  };

  return (
    <>
      <div
        ref={contentEditableRef}
        className={`outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-white/30 cursor-text ${className}`}
        contentEditable
        onInput={handleChange}
        onBlur={handleChange}
        onMouseUp={handleSelect}
        onKeyUp={handleSelect}
        onPaste={handlePaste}
        data-placeholder={placeholder}
        style={{
            ...style,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            display: 'block', // Ensure it behaves like a block for text flow
        }}
        suppressContentEditableWarning={true}
        spellCheck={false}
      />

      {/* FLOATING TOOLBAR (Portal to Body to avoid overflow/scale issues) */}
      {showToolbar && toolbarPosition && createPortal(
        <div 
            className="fixed z-[9999] flex items-center gap-2 px-3 py-2 bg-[#1a1816] rounded-full shadow-xl animate-fadeIn transform -translate-x-1/2"
            style={{ 
                top: toolbarPosition.top, 
                left: toolbarPosition.left 
            }}
            onMouseDown={(e) => e.preventDefault()} // Prevent losing focus on editor
        >
            {/* BOLD BUTTON */}
            <button 
                onClick={toggleBold}
                className="w-8 h-8 flex items-center justify-center text-white font-bold hover:bg-white/10 rounded-full transition-colors"
                title="Жирный"
            >
                B
            </button>

            <div className="w-px h-4 bg-white/20"></div>

            {/* COLOR PRESETS */}
            <button 
                onClick={(e) => applyColor(e, '#FFFFFF')}
                className="w-6 h-6 rounded-full border border-white/20 bg-white hover:scale-110 transition-transform shadow-sm"
                title="Белый"
            />
            <button 
                onClick={(e) => applyColor(e, '#000000')}
                className="w-6 h-6 rounded-full border border-white/20 bg-black hover:scale-110 transition-transform shadow-sm"
                title="Черный"
            />
            {/* Theme Accent Color (if provided and distinct) */}
            {configColor && configColor !== '#FFFFFF' && configColor !== '#000000' && (
                <button 
                    onClick={(e) => applyColor(e, configColor)}
                    className="w-6 h-6 rounded-full border border-white/20 hover:scale-110 transition-transform shadow-sm"
                    style={{ backgroundColor: configColor }}
                    title="Цвет темы"
                />
            )}

            {/* CUSTOM COLOR PICKER */}
            <label className="relative w-6 h-6 rounded-full border border-white/20 bg-gradient-to-tr from-blue-400 via-red-400 to-yellow-400 hover:scale-110 transition-transform cursor-pointer shadow-sm flex items-center justify-center">
                <input 
                    type="color" 
                    className="absolute opacity-0 w-full h-full cursor-pointer top-0 left-0"
                    onChange={(e) => {
                        document.execCommand('foreColor', false, e.target.value);
                        setShowToolbar(false);
                        handleChange();
                    }}
                />
            </label>

        </div>,
        document.body
      )}
    </>
  );
};
