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

const asyncMiddleware = fn => {
  return (req, res, next) => {
    fn(req, res)
      .then(res => next(null, res))
      .catch(err => next(err));
  };
};

module.exports = { concatTextFromNodes, asyncMiddleware };
