import { EditorState, convertFromRaw } from 'draft-js';
import { convertToHTML } from 'draft-convert';
import htmr from 'htmr';
import config from './renderConfig';

import redraft from 'redraft';
import { renderer } from './renderConfig';

export default function DraftRenderer({ raw }){
  // const content = EditorState.createWithContent(convertFromRaw(raw)).getCurrentContent();
  // const markup = convertToHTML({...config})(content);

  const markup = redraft(raw, renderer);

  return (
    <div className='prose dark:prose-invert lg:prose-md'>
      { ((markup)) }
    </div>
  );
}
