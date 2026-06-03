import assert from 'assert';
import { Paragraph } from 'docx';
import {
  appendTextWithLineBreaks,
  renderText,
  renderTextEditor,
  splitTextIntoSegments
} from '../../../../../../client/components/download-link/renderers/helpers/docx-content-renderer';

describe('docx content renderer', () => {
  const countLineBreaks = paragraph => {
    const serialized = JSON.stringify(paragraph.root);
    return (serialized.match(/"rootKey":"w:br"/g) || []).length;
  };

  const createDocStub = () => {
    const paragraphs = [];

    return {
      paragraphs,
      createParagraph(text) {
        const paragraph = new Paragraph(text);
        paragraphs.push(paragraph);
        return paragraph;
      },
      addParagraph(paragraph) {
        paragraphs.push(paragraph);
        return paragraph;
      }
    };
  };

  it('splits text into line-preserving segments', () => {
    assert.deepEqual(
      splitTextIntoSegments('Line one\n• bullet\nLine three'),
      ['Line one', '• bullet', 'Line three']
    );
  });

  it('applies the optional text filter before splitting segments', () => {
    assert.deepEqual(
      splitTextIntoSegments('Line one\nLine two', {
        applyTextFilter: text => text.replace('Line two', 'Filtered two')
      }),
      ['Line one', 'Filtered two']
    );
  });

  it('adds explicit DOCX line breaks for embedded newlines', () => {
    const paragraph = new Paragraph();

    appendTextWithLineBreaks(paragraph, 'Line one\n• bullet\nLine three');

    assert.equal(countLineBreaks(paragraph), 2);
  });

  it('preserves line breaks for plain text values', () => {
    const doc = createDocStub();

    renderText(doc, 'Alpha\nBeta');

    assert.equal(doc.paragraphs.length, 1);
    assert.equal(countLineBreaks(doc.paragraphs[0]), 1);
  });

  it('preserves line breaks inside rich text leaves', () => {
    const doc = createDocStub();
    const value = {
      document: {
        nodes: [
          {
            type: 'paragraph',
            nodes: [
              {
                object: 'text',
                leaves: [
                  {
                    text: 'First line\n• bullet item\nSecond line',
                    marks: []
                  }
                ]
              }
            ]
          }
        ]
      }
    };

    renderTextEditor(doc, value);

    assert.equal(doc.paragraphs.length, 1);
    assert.equal(countLineBreaks(doc.paragraphs[0]), 2);
  });
});

