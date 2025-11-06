'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FORMAT_TEXT_COMMAND } from 'lexical';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const btn = 'px-2 py-1 text-sm rounded border border-gray-300 hover:bg-gray-100 text-gray-700';

  return (
    <div className="flex items-center gap-2 p-2 border-b bg-gray-50">
      <button type="button" className={btn} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}>
        <strong>B</strong>
      </button>
      <button type="button" className={btn} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}>
        <em>I</em>
      </button>
      <button type="button" className={btn} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}>
        <u>U</u>
      </button>
      <span className="mx-1 w-px h-4 bg-gray-300" />
      <button type="button" className={btn} onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}>
        • List
      </button>
      <button type="button" className={btn} onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}>
        1. List
      </button>
      <button type="button" className={btn} onClick={() => editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)}>
        Clear List
      </button>
    </div>
  );
}


