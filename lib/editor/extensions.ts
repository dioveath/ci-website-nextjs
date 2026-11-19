import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Highlight from '@tiptap/extension-highlight';
import { TaskList, TaskItem } from '@tiptap/extension-list';
import { TableKit } from '@tiptap/extension-table';

// The editor and the serializer must agree on the schema, so both import this
// list. Anything not represented here cannot be authored, which is also what
// makes the rendered output safe by construction.
export const editorExtensions = [
  StarterKit.configure({
    link: { openOnClick: false, autolink: true },
    codeBlock: { languageClassPrefix: 'language-' }
  }),
  Image.configure({ inline: false, allowBase64: false }),
  Highlight,
  TaskList,
  TaskItem.configure({ nested: true }),
  TableKit.configure({ table: { resizable: true } })
];
