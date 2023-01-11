import dynamic from 'next/dynamic';

const Output = dynamic(
  async () => (await import('editorjs-react-renderer')).default,
  { ssr: false }
);

const SimpleImageRenderer = ({data, style, classNames, config}) => {
  let content = null;

  if (typeof data === 'string') content = data;
  else if (typeof data === 'object' && data?.url && typeof data.url === 'string') content = data.url;

  // eslint-disable-next-line @next/next/no-img-element
  let figureClass = `relative flex flex-col justify-center items-center my-4 max-w-full h-[300px] overflow-hidden`;

  figureClass += data?.withBackground ? ` bg-riverbed` : ``;
  figureClass += data?.withBorder ? ` border-2` : ` border-none;`;

  const imgClass = `max-w-full max-h-[300px]`;
  imgClass += data?.stretched ? ` w-full` : ``;

  const figCaptionClass = `absolute top-[8px] right-[8px] py-2 px-4 text-xs bg-[#2d333a] text-white  rounded-md`;


  return <figure className={figureClass}>
           {/* eslint-disable-next-line @next/next/no-img-element */}
           {content && <img alt='' className={imgClass} src={ content } />}
           {data?.caption !== '' && <figcaption className={ figCaptionClass }>{ data?.caption }</figcaption>}
          </figure>;
};


const customRenderers = {
  simpleimage: SimpleImageRenderer,
};

export default function EditorJSRenderer({ data }){
  const convertedData = JSON.parse(data);
  
  console.log(convertedData);

  return <section className='prose dark:prose-invert'> <Output
                                                         renderers={customRenderers}
                                                         data={convertedData} /> </section>;
}
