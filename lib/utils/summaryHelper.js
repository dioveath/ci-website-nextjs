// extracts summary from editorjs data (json string)
export function extractSummary(json){
  const data = JSON.parse(json);
  const block = data.blocks.find(b => b.type === 'paragraph');
  return block ? block.data.text : ' ...(empty)';
};
