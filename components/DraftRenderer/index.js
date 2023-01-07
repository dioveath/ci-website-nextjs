import { EditorState, convertFromRaw } from 'draft-js';
import { convertToHTML } from 'draft-convert';
import htmr from 'htmr';
import config from './renderConfig';

export default function DraftRenderer({ raw }){
  const content = EditorState.createWithContent(convertFromRaw(raw)).getCurrentContent();
  const markup = convertToHTML({...config})(content);

  return (
    <>
      { (htmr(markup)) }
    </>
  );
}
