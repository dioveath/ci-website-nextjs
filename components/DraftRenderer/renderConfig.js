const config = {
  blockToHTML: (block) => {
    switch(block.type){
    case 'code':
      return <pre/>;
    case 'atomic':
      return <div className="w-full"/>;
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
               />;               
             </div>;
    }
    return originalText;
  }
};


export default config;
