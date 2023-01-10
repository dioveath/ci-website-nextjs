import  { createReactEditorJS } from 'react-editor-js';
import Undo from 'editorjs-undo';
import '../../styles/react-editor/react-editor.module.css';
import { EDITOR_JS_TOOLS } from '../../lib/editorjs/tools';

const EditorJS = createReactEditorJS();


const ReactEditorJS = ({ data, images, innerRef }) => {

  const handleInitialize = (instance) => {
    innerRef.current = instance;
  };

  const handleReady = () => {
    const editor = innerRef.current._editorJS;
    new Undo({ editor });
  };

  return <EditorJS onInitialize={handleInitialize}
                   onReady={handleReady}
                   tools={EDITOR_JS_TOOLS} data={data}
                   placeholder={`Write your amazing article here...`}/>;
};

export default ReactEditorJS;
