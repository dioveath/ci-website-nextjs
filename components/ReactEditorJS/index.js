import dynamic from 'next/dynamic';
import { createReactEditorJS } from "react-editor-js";
import "../../styles/react-editor/react-editor.module.css";
import { UserService } from "../../lib/service/UserService";

import Embed from '@editorjs/embed';
import Table from "@editorjs/table";
import List from "@editorjs/list";
import Warning  from "@editorjs/warning";
import Code  from "@editorjs/code";
import LinkTool  from "@editorjs/link";
import Image  from "@editorjs/image";
import Raw from '@editorjs/raw';
import Header  from "@editorjs/header";
import Quote  from "@editorjs/quote";
import Marker  from "@editorjs/marker";
import CheckList  from "@editorjs/checklist";
import Delimiter from '@editorjs/delimiter';
import InlineCode  from "@editorjs/inline-code";
import SimpleImage  from "@editorjs/simple-image";
import Undo  from 'editorjs-undo';

const EditorJS = createReactEditorJS();

const ReactEditorJS = ({ data, images, innerRef, userId }) => {
  const EDITOR_JS_TOOLS = {
    embed: Embed,
    table: Table,
    list: List,
    warning: Warning,
    code: Code,
    linkTool: LinkTool,
    image: {
      class: Image,
      config: {
        uploader: {
          async uploadByFile(file) {
            const data = await UserService.addMedia(userId, file);
            images.push(data);

            return {
              success: 1,
              file: {
                url: data.downloadURL,
              },
            };
          },
        },
      },
    },
    header: Header,
    quote: Quote,
    marker: Marker,
    checklist: CheckList,
    delimiter: Delimiter,
    inlineCode: InlineCode,
    simpleImage: SimpleImage,
  };

  const handleInitialize = (instance) => {
    innerRef.current = instance;
  };

  const handleReady = () => {
    const editor = innerRef.current._editorJS;
    new Undo({ editor });
  };

  return (
    <EditorJS
      onInitialize={handleInitialize}
      onReady={handleReady}
      tools={EDITOR_JS_TOOLS}
      data={data}
      placeholder={`Write your amazing article here...`}
    />
  );
};

export default ReactEditorJS;
