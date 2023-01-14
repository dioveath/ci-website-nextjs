import dynamic from 'next/dynamic';
import { createReactEditorJS } from "react-editor-js";
import "../../styles/react-editor/react-editor.module.css";
import { UserService } from "../../lib/service/UserService";

const Table = dynamic(() => import ("@editorjs/table"), { ssr: false });
const List = dynamic(() => import ("@editorjs/list"), { ssr: false });
const Warning = dynamic(() => import("@editorjs/warning"), { ssr: false });
const Code = dynamic(() => import("@editorjs/code"), { ssr: false });

const LinkTool = dynamic(() => import("@editorjs/link"), { ssr: false });
const Image = dynamic(() => import("@editorjs/image"), { ssr: false });
const Header = dynamic(() => import("@editorjs/header"), { ssr: false });
const Quote = dynamic(() => import("@editorjs/quote"), { ssr: false });
const Marker = dynamic(() => import("@editorjs/marker"), { ssr: false });
const CheckList = dynamic(() => import("@editorjs/checklist"), { ssr: false });
const InlineCode = dynamic(() => import("@editorjs/inline-code"), { ssr: false });
const SimpleImage = dynamic(() => import("@editorjs/simple-image"), { ssr: false});
const Undo = dynamic(() => import('editorjs-undo'), { ssr: false });

const Embed = dynamic(() => import('@editorjs/embed'), { ssr: false });

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
    // raw: Raw,
    header: Header,
    quote: Quote,
    marker: Marker,
    checklist: CheckList,
    // delimiter: Delimiter,
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
