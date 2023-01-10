import Output from 'editorjs-react-renderer';


export default function EditorJSRenderer({ data }){
  const convertedData = JSON.parse(data);
  return <section className='prose dark:prose-invert'> <Output data={convertedData} /> </section>;
}
