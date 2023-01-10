import Output from 'editorjs-react-renderer';


export default function EditorJSRenderer({ data }){
  return <section className='prose dark:prose-invert'> <Output data={data} /> </section>;
}
