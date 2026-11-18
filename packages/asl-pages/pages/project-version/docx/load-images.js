const fetch = require('node-fetch');
const {imageSize} = require('image-size');

const MAX_IMAGE_WIDTH = 600;
const MAX_IMAGE_HEIGHT = 800;

const scaleAndPreserveAspectRatio = (srcWidth, srcHeight, maxWidth, maxHeight) => {
  const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
  return {width: srcWidth * ratio, height: srcHeight * ratio};
};

const getDataUrl = async (attachmentHost, data) => {
  if (data.src && data.src.match(/^data:/)) {
    return data.src;
  }
  if (attachmentHost && data.token) {
    const response = await fetch(`${attachmentHost}/${data.token}`);
    if (response.status === 200) {
      const base64 = Buffer.from(await response.arrayBuffer()).toString('base64');
      return `data:${response.headers.get('content-type')};base64,${base64}`;
    }
  }
};

const loadImages = attachmentHost => async node => {
  const url = await getDataUrl(attachmentHost, node.data);
  if (!url) {
    return node;
  }
  // url starts with the format data:image/type; so we use characters between index 11 and ; as the file type
  const imageType = url.substring(11, url.indexOf(';'));
  if (imageType === 'png' || imageType === 'jpeg') {
    const src = url.substring(url.indexOf(',') + 1);
    const buffer = Buffer.from(src, 'base64');
    let dimensions = imageSize(buffer);
    dimensions = scaleAndPreserveAspectRatio(
      dimensions.width,
      dimensions.height,
      MAX_IMAGE_WIDTH,
      MAX_IMAGE_HEIGHT
    );
    node.data.width = dimensions.width;
    node.data.height = dimensions.height;
    node.data.src = url;
    return node;
  } else {
    return {
      type: 'error',
      nodes: [{
        text: 'Image type unsupported. Please use a JPG or PNG image for DOCX exports.',
        marks: [],
        object: 'text'
      }]
    };
  }
};

module.exports = {
  loadImages
};
