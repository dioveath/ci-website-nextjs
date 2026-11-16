'use client';

import { useCallback, useEffect, useImperativeHandle, type ReactNode, type RefObject } from 'react';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';

import { editorExtensions } from '../../lib/editor/extensions';
import { editorjsToHtml, isLegacyDocument } from '../../lib/editor/serialize';
import { UserService } from '../../lib/service/UserService';
import type { ArticleBody, Media, TiptapDoc } from '../../types';

import {
  RiBold, RiItalic, RiUnderline, RiStrikethrough, RiMarkPenLine, RiCodeLine,
  RiH2, RiH3, RiListUnordered, RiListOrdered, RiListCheck2, RiDoubleQuotesL,
  RiCodeBoxLine, RiSeparator, RiLink, RiImageAddLine, RiTable2, RiArrowGoBackLine,
  RiArrowGoForwardLine
} from 'react-icons/ri';

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: ReactNode;
}

function ToolbarButton({ onClick, active, disabled, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active ? 'true' : 'false'}
      disabled={disabled}
      onClick={onClick}
      className={`p-2 rounded transition-colors disabled:opacity-40 ${
        active ? 'bg-brightaqua text-white' : 'text-white hover:bg-slategray'
      }`}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor, onPickImage }: { editor: Editor | null; onPickImage: () => void }) {
  if (!editor) return null;

  const setLink = () => {
    const previous = editor.getAttributes('link').href ?? '';
    const url = window.prompt('Link URL (leave empty to remove)', previous);
    if (url === null) return;
    if (url === '') return editor.chain().focus().extendMarkRange('link').unsetLink().run();
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap gap-1 border-b border-slategray pb-2 mb-3 not-prose">
      <ToolbarButton title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><RiBold/></ToolbarButton>
      <ToolbarButton title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><RiItalic/></ToolbarButton>
      <ToolbarButton title="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}><RiUnderline/></ToolbarButton>
      <ToolbarButton title="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}><RiStrikethrough/></ToolbarButton>
      <ToolbarButton title="Highlight" active={editor.isActive('highlight')} onClick={() => editor.chain().focus().toggleHighlight().run()}><RiMarkPenLine/></ToolbarButton>
      <ToolbarButton title="Inline code" active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()}><RiCodeLine/></ToolbarButton>

      <ToolbarButton title="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><RiH2/></ToolbarButton>
      <ToolbarButton title="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><RiH3/></ToolbarButton>

      <ToolbarButton title="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><RiListUnordered/></ToolbarButton>
      <ToolbarButton title="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><RiListOrdered/></ToolbarButton>
      <ToolbarButton title="Checklist" active={editor.isActive('taskList')} onClick={() => editor.chain().focus().toggleTaskList().run()}><RiListCheck2/></ToolbarButton>

      <ToolbarButton title="Quote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}><RiDoubleQuotesL/></ToolbarButton>
      <ToolbarButton title="Code block" active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><RiCodeBoxLine/></ToolbarButton>
      <ToolbarButton title="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}><RiSeparator/></ToolbarButton>

      <ToolbarButton title="Link" active={editor.isActive('link')} onClick={setLink}><RiLink/></ToolbarButton>
      <ToolbarButton title="Insert image" onClick={onPickImage}><RiImageAddLine/></ToolbarButton>
      <ToolbarButton title="Insert table" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}><RiTable2/></ToolbarButton>

      <ToolbarButton title="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}><RiArrowGoBackLine/></ToolbarButton>
      <ToolbarButton title="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}><RiArrowGoForwardLine/></ToolbarButton>
    </div>
  );
}

/*
 * Drop-in replacement for the old ReactEditorJS component. It keeps the same
 * prop surface and the same innerRef.current.save() contract so the containers
 * around it did not have to change shape -- save() now resolves a Tiptap
 * document instead of EditorJS blocks.
 *
 * Legacy EditorJS bodies are converted to HTML on load, which Tiptap parses
 * into its own schema. Saving then writes the new format, so articles migrate
 * as they are edited.
 */
/** What innerRef exposes to the containers around this editor. */
export interface TiptapEditorHandle {
  save: () => Promise<TiptapDoc | null>;
  getHtml: () => string;
  editor: Editor | null;
}

interface TiptapEditorProps {
  data?: ArticleBody | null;
  images: Media[];
  innerRef: RefObject<TiptapEditorHandle | null>;
  userId: string;
}

export default function TiptapEditor({ data, images, innerRef, userId }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: editorExtensions,
    content: isLegacyDocument(data) ? editorjsToHtml(data) : ((data as object | null) ?? ''),
    immediatelyRender: false, // required under SSR
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none focus:outline-hidden min-h-[300px]'
      }
    }
  });

  useImperativeHandle(innerRef, () => ({
    save: async () => (editor?.getJSON() as TiptapDoc | undefined) ?? null,
    getHtml: () => editor?.getHTML() ?? '',
    editor
  }), [editor]);

  const uploadImage = useCallback(async (file?: File) => {
    if (!file || !editor) return;
    try {
      const media = await UserService.addMedia(userId, file);
      images.push(media);
      editor.chain().focus().setImage({ src: media.downloadURL, alt: file.name }).run();
    } catch (err) {
      console.log(err instanceof Error ? err.message : String(err));
    }
  }, [editor, images, userId]);

  const pickImage = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => uploadImage(input.files?.[0]);
    input.click();
  }, [uploadImage]);

  // Paste and drop straight into the editor, matching what EditorJS allowed.
  useEffect(() => {
    if (!editor) return;
    const dom = editor.view.dom;

    const onDrop = (e: DragEvent) => {
      const file = [...(e.dataTransfer?.files || [])].find((f) => f.type.startsWith('image/'));
      if (!file) return;
      e.preventDefault();
      uploadImage(file);
    };
    const onPaste = (e: ClipboardEvent) => {
      const file = [...(e.clipboardData?.files || [])].find((f) => f.type.startsWith('image/'));
      if (!file) return;
      e.preventDefault();
      uploadImage(file);
    };

    dom.addEventListener('drop', onDrop);
    dom.addEventListener('paste', onPaste);
    return () => {
      dom.removeEventListener('drop', onDrop);
      dom.removeEventListener('paste', onPaste);
    };
  }, [editor, uploadImage]);

  return (
    <div className="w-full">
      <Toolbar editor={editor} onPickImage={pickImage}/>
      <EditorContent editor={editor}/>
    </div>
  );
}
