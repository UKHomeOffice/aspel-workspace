const getTextFromNodes = (nodes) => {
  let tempText = '';
  nodes?.forEach((element) => {
    if (element?.object === 'block') {
      tempText += getTextFromNodes(element?.nodes);
    } else if (element?.object === 'text') {
      tempText += element.text + ' ';
    }
  });
  return tempText;
};

module.exports = { getTextFromNodes };
