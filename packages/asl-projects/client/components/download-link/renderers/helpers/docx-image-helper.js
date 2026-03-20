// 600px seems to be roughly 100% page width (inside the margins)
const MAX_IMAGE_WIDTH = 600;
const MAX_IMAGE_HEIGHT = 800;
const DEFAULT_IMAGE_ROOT = '/attachment';
const IMAGE_PLACEHOLDER_TEXT = '[Image unavailable in export]';

const scaleAndPreserveAspectRatio = (srcWidth, srcHeight, maxWidth, maxHeight) => {
  const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
  return { width: srcWidth * ratio, height: srcHeight * ratio };
};

const blobToDataUri = blob => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to convert image to data URI'));
    reader.readAsDataURL(blob);
  });
};

const fetchAsDataUri = src => {
  if (typeof fetch !== 'function') {
    return Promise.reject(new Error('Fetch unavailable for image export'));
  }

  return fetch(src)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load image: ${response.status}`);
      }
      return response.blob();
    })
    .then(blobToDataUri);
};

const toAttachmentUrl = (token, imageRoot) => {
  const base = (imageRoot || DEFAULT_IMAGE_ROOT).replace(/\/+$/, '');
  return `${base}/${encodeURIComponent(token)}`;
};

const firstSuccessful = candidates => {
  let index = 0;

  const next = () => {
    if (index >= candidates.length) {
      return Promise.reject(new Error('All image source attempts failed'));
    }

    const candidate = candidates[index++];
    return fetchAsDataUri(candidate).catch(next);
  };

  return next();
};

const resolveImageSource = (node, imageRoot) => {
  const src = node && node.data && node.data.src;
  const token = node && node.data && node.data.token;

  if (src && typeof src === 'string' && src.startsWith('data:')) {
    return Promise.resolve(src);
  }

  if (src) {
    return fetchAsDataUri(src)
      .catch(() => {
        if (!token) {
          return Promise.reject(new Error('Failed to resolve image src'));
        }

        const tokenSources = [toAttachmentUrl(token, imageRoot)];
        const defaultTokenUrl = toAttachmentUrl(token, DEFAULT_IMAGE_ROOT);
        if (tokenSources[0] !== defaultTokenUrl) {
          tokenSources.push(defaultTokenUrl);
        }

        return firstSuccessful(tokenSources);
      });
  }

  if (token) {
    const tokenSources = [toAttachmentUrl(token, imageRoot)];
    const defaultTokenUrl = toAttachmentUrl(token, DEFAULT_IMAGE_ROOT);
    if (tokenSources[0] !== defaultTokenUrl) {
      tokenSources.push(defaultTokenUrl);
    }

    return firstSuccessful(tokenSources);
  }

  return Promise.reject(new Error('Image node has no src or token'));
};

const updateImageDimensions = (node, imageRoot) => {
  if (!node || !node.data) {
    return Promise.resolve(node);
  }

  return resolveImageSource(node, imageRoot)
    .then(src => {
      node.data.src = src;

      return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = src;

        image.onload = () => {
          const dimensions = scaleAndPreserveAspectRatio(
            image.naturalWidth,
            image.naturalHeight,
            MAX_IMAGE_WIDTH,
            MAX_IMAGE_HEIGHT
          );
          node.data.width = dimensions.width;
          node.data.height = dimensions.height;
          delete node.data.renderError;
          delete node.data.renderErrorMessage;
          resolve(node);
        };

        image.onerror = () => reject(new Error('Unable to calculate image dimensions'));
      });
    })
    .catch(() => {
      node.data.renderError = true;
      node.data.renderErrorMessage = IMAGE_PLACEHOLDER_TEXT;
      return node;
    });
};

export { resolveImageSource, updateImageDimensions };