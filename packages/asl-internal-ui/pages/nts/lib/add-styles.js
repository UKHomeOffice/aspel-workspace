const addStyles = doc => {
  doc.Styles.createParagraphStyle('Heading1', 'Heading 1')
    .basedOn('Normal')
    .next('Normal')
    .quickFormat()
    .size(36)
    .bold()
    .font('Helvetica')
    .spacing({ before: 360, after: 400 });

  doc.Styles.createParagraphStyle('Heading2', 'Heading 2')
    .basedOn('Normal')
    .next('Normal')
    .quickFormat()
    .size(24)
    .bold()
    .font('Helvetica')
    .spacing({ before: 200, after: 200 });

  doc.Styles.createParagraphStyle('Heading3', 'Heading 3')
    .basedOn('Normal')
    .next('Normal')
    .quickFormat()
    .size(28)
    .bold()
    .font('Helvetica')
    .spacing({ before: 400, after: 200 });

  doc.Styles.createParagraphStyle('body', 'Body')
    .basedOn('Normal')
    .next('Normal')
    .quickFormat()
    .size(24)
    .font('Helvetica')
    .spacing({ before: 200, after: 200 });

  doc.Styles.createParagraphStyle('ListParagraph', 'List Paragraph')
    .basedOn('Normal')
    .next('Normal')
    .quickFormat()
    .size(24)
    .font('Helvetica')
    .spacing({ before: 100, after: 100 });

  doc.Styles.createParagraphStyle('aside', 'Aside')
    .basedOn('Body')
    .next('Body')
    .quickFormat()
    .size(24)
    .color('999999')
    .italics();

  return doc;
};

module.exports = addStyles;
