'use client';

import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';

// Dynamically import MDEditor to avoid SSR issues
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  height?: number;
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Enter text...", 
  className = "",
  height = 400
}: RichTextEditorProps) {
  return (
    <div className={`rich-text-editor ${className}`}>
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || '')}
        data-color-mode="light"
        height={height}
        visibleDragbar={false}
        hideToolbar={false}
        textareaProps={{
          placeholder: placeholder,
        }}
      />
    </div>
  );
}
