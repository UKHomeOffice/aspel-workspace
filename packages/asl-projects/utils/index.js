const concatTextFromNodes = (nodes) => {
  const getAllNodes = (elements) => {
    let texts = [];
    elements?.forEach((element) => {
      if (element?.object === 'block') {
        texts.push(getAllNodes(element?.nodes));
      } else if (element?.object === 'text') {
        texts.push(element.text);
      }
    });
    return texts;
  };
  return getAllNodes(nodes).join(' ');
};

module.exports = { concatTextFromNodes };
