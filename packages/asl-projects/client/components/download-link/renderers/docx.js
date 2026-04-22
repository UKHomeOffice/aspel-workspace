import saveAs from 'file-saver';
import { Packer } from 'docx';
import renderer from './docx-renderer';
import { updateImageDimensions } from './helpers/docx-image-helper';

const pack = (doc, filename) => {
  Packer.toBlob(doc).then(blob => {
    saveAs(blob, filename);
  });
};

export default application => {
  return {
    render: ({ sections, values, imageRoot }) => {
      return Promise.resolve()
        .then(() => renderer(
          application,
          sections,
          values,
          node => updateImageDimensions(node, imageRoot)
        ))
        .then(doc => pack(doc, values.title));
    }
  };
};
