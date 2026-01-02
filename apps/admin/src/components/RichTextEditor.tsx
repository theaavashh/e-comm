"use client";

import { useState, useCallback, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import "./tiptap-styles.css";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  height?: number;
  disabled?: boolean;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Enter text...",
  className = "",
  height = 400,
  disabled = false,
}: RichTextEditorProps) {
  const [isClient, setIsClient] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto",
        },
      }),
      TextStyle,
      Color.configure({
        types: ["textStyle"],
      }),
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
        placeholder: placeholder,
      },
    },
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  const setLink = useCallback(() => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const addImage = useCallback(() => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!isClient) {
    return (
      <div
        className="border rounded-lg animate-pulse bg-gray-50"
        style={{ height }}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-500">Loading editor...</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`border rounded-lg overflow-hidden ${className}`}
      style={{ height }}
    >
      <div className="border-b border-gray-200 bg-gray-50 p-2 flex flex-wrap gap-1">
        {/* Text Formatting */}
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          disabled={!editor || disabled}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor?.isActive("bold")
              ? "bg-blue-500 text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <strong>B</strong>
        </button>

        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          disabled={!editor || disabled}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor?.isActive("italic")
              ? "bg-blue-500 text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <em>I</em>
        </button>

        <button
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          disabled={!editor || disabled}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor?.isActive("strike")
              ? "bg-blue-500 text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <s>S</s>
        </button>

        {/* Headings */}
        <select
          onChange={(e) => {
            const level = e.target.value;
            if (level) {
              const levelNum = parseInt(level);
              editor
                ?.chain()
                .focus()
                .toggleHeading({ level: levelNum as any })
                .run();
            } else {
              editor?.chain().focus().setParagraph().run();
            }
          }}
          disabled={!editor || disabled}
          className="px-2 py-1 rounded text-sm border border-gray-300 bg-white text-gray-700"
        >
          <option value="">Normal</option>
          <option value="1">H1</option>
          <option value="2">H2</option>
          <option value="3">H3</option>
          <option value="4">H4</option>
          <option value="5">H5</option>
          <option value="6">H6</option>
        </select>

        {/* Lists */}
        <button
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          disabled={!editor || disabled}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor?.isActive("bulletList")
              ? "bg-blue-500 text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          •
        </button>

        <button
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          disabled={!editor || disabled}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor?.isActive("orderedList")
              ? "bg-blue-500 text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          1.
        </button>

        {/* Links and Images */}
        <button
          onClick={setLink}
          disabled={!editor || disabled}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor?.isActive("link")
              ? "bg-blue-500 text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          🔗
        </button>

        <button
          onClick={addImage}
          disabled={!editor || disabled}
          className="px-3 py-1 rounded text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          🖼️
        </button>

        {/* Undo/Redo */}
        <button
          onClick={() => editor?.chain().focus().undo().run()}
          disabled={!editor || !editor.can().undo() || disabled}
          className="px-3 py-1 rounded text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          ↶
        </button>

        <button
          onClick={() => editor?.chain().focus().redo().run()}
          disabled={!editor || !editor.can().redo() || disabled}
          className="px-3 py-1 rounded text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          ↷
        </button>
      </div>

      <EditorContent
        editor={editor}
        className="prose max-w-none p-4 min-h-[300px] focus:outline-none"
        style={{ height: height - 50, overflow: "auto" }}
      />
    </div>
  );
}
