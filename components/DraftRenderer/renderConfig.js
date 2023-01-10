const config = {
  blockToHTML: (block) => {

    switch(block.type){
    case 'code':
      return <pre className='language-js'/>;
    case 'atomic':
      return <div className="w-full"/>;
    case 'unstyled':
    case 'paragraph':
      const style = ``;
      const { text } = block;

      if(block.data['text-align']){
        style += `text-${block.data['text-align']}`;
      }

      // let spans = [];
      // if(block.inlineStyleRanges){
      //   block.inlineStyleRanges.forEach(range => {
      //     spans.push(<span>{ text.substring(range.offset, range.offset + range.length) }</span>);
      //   });
      // }

      return <p className={style}></p>;
    case 'subscript':
      return <sub/>;
    case 'header-two':
      return <h2/>;
    }

    return null;
  },
  entityToHTML: (entity, originalText) => {
    switch(entity.type){
    case 'LINK':
      return <a href={entity.data.url}>{originalText}</a>;
    case 'IMAGE':
      const classStyle = 'justify-center';
      if(entity.data?.alignment === 'right')
        classStyle = 'justify-end';
      else if(entity.data?.alignment === 'left')
        classStyle = 'justify-start';
      return <div className={`w-full flex ${classStyle}`}>
               <img alt={"Image"}
                    src={entity.data.src}
                    width={entity.data.width}
                    height={entity.data.height}
               />
             </div>;
    }
    return originalText;
  }
};


export default config;
