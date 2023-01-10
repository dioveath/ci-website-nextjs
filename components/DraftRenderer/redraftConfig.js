import Link from 'next/link';

/**
 *  You can use inline styles or classNames inside your callbacks
 */
const styles = {
  code: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
  codeBlock: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 20,
  },
};
 
// just a helper to add a <br /> after a block
// eslint-disable-next-line react/jsx-key
const addBreaklines = (children) => children.map(child => [child, <br />]);
 
/**
 * Define the renderers
 */
const renderers = {
  /**
   * Those callbacks will be called recursively to render a nested structure
   */
  inline: {
    // The key passed here is just an index based on rendering order inside a block
    BOLD: (children, { key }) => <strong key={key}>{children}</strong>,
    ITALIC: (children, { key }) => <em key={key}>{children}</em>,
    UNDERLINE: (children, { key }) => <u key={key}>{children}</u>,
    CODE: (children, { key }) => <span key={key} style={styles.code}>{children}</span>,
  },
  /**
   * Blocks receive children and depth
   * Note that children are an array of blocks with same styling,
   */
  blocks: {
    // eslint-disable-next-line react/jsx-key
    unstyled: (children) => children.map(child => <p>{child}</p>),
    blockquote: (children) => <blockquote >{addBreaklines(children)}</blockquote>,
    // eslint-disable-next-line react/jsx-key
    'header-one': (children) => children.map(child => <h1>{child}</h1>),
    // eslint-disable-next-line react/jsx-key
    'header-two': (children) => children.map(child => <h2>{child}</h2>),
    // You can also access the original keys of the blocks
    'code-block': (children, { keys }) => <pre style={styles.codeBlock} key={keys[0]}>{addBreaklines(children)}</pre>,
    // or depth for nested lists
    // eslint-disable-next-line react/jsx-key
    'unordered-list-item': (children, { depth, keys }) => <ul key={keys[keys.length - 1]} className={`ul-level-${depth}`}>{children.map(child => <li>{child}</li>)}</ul>,
    'ordered-list-item': (children, { depth, keys }) => <ol key={keys.join('|')} className={`ol-level-${depth}`}>{children.map((child, index) => <li key={keys[index]}>{child}</li>)}</ol>,
    // If your blocks use meta data it can also be accessed like keys
    atomic: (children, { keys, data }) => children.map((child, i) => <Atomic key={keys[i]} {...data[i]} />),
  },
  /**
   * Entities receive children and the entity data
   */
  entities: {
    // key is the entity key value from raw
    LINK: (children, data, { key }) => <Link key={key} href={data.url}>{children}</Link>,
  },
  /**
   * Array of decorators,
   * Entities receive children and the entity data,
   * inspired by https://facebook.github.io/draft-js/docs/advanced-topics-decorators.html
   * it's also possible to pass a custom Decorator class that matches the [DraftDecoratorType](https://github.com/facebook/draft-js/blob/master/src/model/decorators/DraftDecoratorType.js)
   */
  decorators: [
    {
      // by default linkStrategy receives a ContentBlock stub (more info under Creating the ContentBlock)
      // strategy only receives first two arguments, contentState is yet not provided
      // strategy: linkStrategy,
      // component - a callback as with other renderers
      // decoratedText a plain string matched by the strategy
      // if your decorator depends on draft-js contentState you need to provide convertFromRaw in redraft options
      component: ({ children, decoratedText }) => <a href={decoratedText}>{children}</a>,
    },
    // new CustomDecorator(someOptions),
  ],
};


export { renderers };
