export const getTextFromNodes = (nodes = []) =>
  nodes
    .map(node => {
      if (node.text) {
        return node.text;
      }
      if (node.nodes) {
        return getTextFromNodes(node.nodes);
      }
      return '';
    })
    .join('');
