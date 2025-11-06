'use client';

import { useEffect, useRef } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { LinkNode } from '@lexical/link';
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import { $getRoot, $insertNodes } from 'lexical';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import ToolbarPlugin from './plugins/ToolbarPlugin';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  height?: number;
}

function OnChange({ onChange }: { onChange: (value: string) => void }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const root = $getRoot();
        const htmlString = $generateHtmlFromNodes(editor, null);
        onChange(htmlString);
      });
    });
  }, [editor, onChange]);

  return null;
}

function InitialValuePlugin({ value }: { value: string }) {
  const [editor] = useLexicalComposerContext();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current && value && value.trim() !== '') {
      isFirstRender.current = false;
      editor.update(() => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(value, 'text/html');
        const nodes = $generateNodesFromDOM(editor, dom);
        const root = $getRoot();
        root.clear();
        root.select();
        if (nodes.length > 0) {
          $insertNodes(nodes);
        }
      }, { discrete: true });
    }
  }, [editor, value]);

  return null;
}

const theme = {
  ltr: 'ltr',
  rtl: 'rtl',
  placeholder: 'editor-placeholder',
  paragraph: 'editor-paragraph',
  quote: 'editor-quote',
  heading: {
    h1: 'editor-heading-h1',
    h2: 'editor-heading-h2',
    h3: 'editor-heading-h3',
    h4: 'editor-heading-h4',
    h5: 'editor-heading-h5',
    h6: 'editor-heading-h6',
  },
  list: {
    nested: {
      listitem: 'editor-nested-listitem',
    },
    ol: 'editor-list-ol',
    ul: 'editor-list-ul',
    listitem: 'editor-listitem',
  },
  link: 'editor-link',
  text: {
    bold: 'editor-text-bold',
    italic: 'editor-text-italic',
    underline: 'editor-text-underline',
    strikethrough: 'editor-text-strikethrough',
    code: 'editor-text-code',
  },
  code: 'editor-code',
  codeHighlight: {
    atrule: 'editor-code-highlight',
    attr: 'editor-code-highlight',
    boolean: 'editor-code-highlight',
    builtin: 'editor-code-highlight',
    cdata: 'editor-code-highlight',
    char: 'editor-code-highlight',
    class: 'editor-code-highlight',
    comment: 'editor-code-highlight',
    constant: 'editor-code-highlight',
    deleted: 'editor-code-highlight',
    doctype: 'editor-code-highlight',
    entity: 'editor-code-highlight',
    function: 'editor-code-highlight',
    important: 'editor-code-highlight',
    inserted: 'editor-code-highlight',
    keyword: 'editor-code-highlight',
    namespace: 'editor-code-highlight',
    number: 'editor-code-highlight',
    operator: 'editor-code-highlight',
    prolog: 'editor-code-highlight',
    property: 'editor-code-highlight',
    punctuation: 'editor-code-highlight',
    regex: 'editor-code-highlight',
    selector: 'editor-code-highlight',
    string: 'editor-code-highlight',
    symbol: 'editor-code-highlight',
    tag: 'editor-code-highlight',
    url: 'editor-code-highlight',
    variable: 'editor-code-highlight',
  },
};

function onError(error: Error) {
  console.error(error);
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Enter text...",
  className = "",
  height = 400
}: RichTextEditorProps) {
  const initialConfig = {
    namespace: 'RichTextEditor',
    theme,
    onError,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      LinkNode,
    ],
  };

  return (
    <div className={`lexical-editor ${className}`} style={{ minHeight: `${height}px` }}>
      <LexicalComposer initialConfig={initialConfig}>
        <div className="editor-container border border-gray-300 rounded-lg overflow-hidden bg-white">
          <ToolbarPlugin />
          <div className="editor-inner relative bg-white" style={{ minHeight: `${height - 50}px` }}>
            <RichTextPlugin
              contentEditable={
                <ContentEditable className="editor-input outline-none px-4 py-3 text-black" />
              }
              placeholder={
                <div className="editor-placeholder absolute top-3 left-4 text-gray-400 pointer-events-none">
                  {placeholder}
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <LinkPlugin />
            <ListPlugin />
            <OnChange onChange={onChange} />
            <InitialValuePlugin value={value} />
          </div>
        </div>
      </LexicalComposer>
      <style jsx global>{`
        .lexical-editor .editor-input {
          min-height: ${height - 50}px;
          resize: none;
        }
        .lexical-editor .editor-input:focus {
          outline: none;
        }
        .lexical-editor .editor-placeholder {
          color: #9ca3af;
        }
        .lexical-editor .editor-paragraph {
          margin: 0;
          margin-bottom: 8px;
          position: relative;
        }
        .lexical-editor .editor-heading-h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
          margin-bottom: 8px;
        }
        .lexical-editor .editor-heading-h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
          margin-bottom: 8px;
        }
        .lexical-editor .editor-heading-h3 {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0;
          margin-bottom: 8px;
        }
        .lexical-editor .editor-text-bold {
          font-weight: 700;
        }
        .lexical-editor .editor-text-italic {
          font-style: italic;
        }
        .lexical-editor .editor-text-underline {
          text-decoration: underline;
        }
        .lexical-editor .editor-text-strikethrough {
          text-decoration: line-through;
        }
        .lexical-editor .editor-text-code {
          background-color: #f3f4f6;
          padding: 2px 4px;
          border-radius: 3px;
          font-family: monospace;
        }
        .lexical-editor .editor-list-ol,
        .lexical-editor .editor-list-ul {
          padding-left: 30px;
        }
        .lexical-editor .editor-link {
          color: #2563eb;
          text-decoration: underline;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}