import { Numbering, TextRun } from 'docx';

const addStyles = (document) => {
    document.Styles.createParagraphStyle('Question', 'Question')
        .basedOn('Normal')
        .next('Normal')
        .quickFormat()
        .size(24)
        .indent(800)
        .bold()
        .color('#3B3B3B')
        .font('Helvetica')
        .spacing({ before: 200, after: 50 });

    document.Styles.createParagraphStyle('SectionTitle', 'Section Title')
        .basedOn('Normal')
        .next('Normal')
        .quickFormat()
        .size(44)
        .bold()
        .color('#8F23B3')
        .font('Helvetica')
        .spacing({ before: 500, after: 300 });

    document.Styles.createParagraphStyle('ProtocolSectionTitle', 'Protocol Section Title')
        .basedOn('Normal')
        .next('Normal')
        .quickFormat()
        .size(34)
        .bold()
        .color('#005EA5')
        .font('Helvetica')
        .spacing({ before: 500, after: 300 });

    document.Styles.createParagraphStyle('Heading1', 'Heading 1')
        .basedOn('Normal')
        .next('Normal')
        .quickFormat()
        .size(52)
        .bold()
        .font('Helvetica')
        .spacing({ before: 360, after: 400 });

    document.Styles.createParagraphStyle('Heading2', 'Heading 2')
        .basedOn('Normal')
        .next('Normal')
        .quickFormat()
        .size(44)
        .bold()
        .font('Helvetica')
        .spacing({ before: 400, after: 300 });

    document.Styles.createParagraphStyle('Heading3', 'Heading 3')
        .basedOn('Normal')
        .next('Normal')
        .quickFormat()
        .size(36)
        .bold()
        .font('Helvetica')
        .spacing({ before: 400, after: 200 });

    document.Styles.createParagraphStyle('Heading4', 'Heading 4')
        .basedOn('Normal')
        .next('Normal')
        .quickFormat()
        .size(32)
        .bold()
        .font('Helvetica')
        .spacing({ before: 400, after: 200 });

    document.Styles.createParagraphStyle('Heading5', 'Heading 5')
        .basedOn('Normal')
        .next('Normal')
        .quickFormat()
        .size(24)
        .bold()
        .font('Helvetica')
        .spacing({ before: 200, after: 50 });

    document.Styles.createParagraphStyle('body', 'Body')
        .basedOn('Normal')
        .next('Normal')
        .quickFormat()
        .size(24)
        .font('Helvetica')
        .spacing({ before: 200, after: 200 });

    document.Styles.createParagraphStyle('ListParagraph', 'List Paragraph')
        .basedOn('Normal')
        .next('Normal')
        .quickFormat()
        .size(24)
        .font('Helvetica')
        .spacing({ before: 100, after: 100 });

    document.Styles.createParagraphStyle('aside', 'Aside')
        .basedOn('Body')
        .next('Body')
        .quickFormat()
        .size(24)
        .color('999999')
        .italics();

    document.Styles.createParagraphStyle('footerText', 'Footer Text')
        .basedOn('Normal')
        .next('Normal')
        .quickFormat()
        .font('Helvetica')
        .size(20);

    document.Styles.createParagraphStyle('error', 'Error')
        .basedOn('Body')
        .next('Body')
        .quickFormat()
        .color('FF0000')
        .bold();
};

const renderHorizontalRule = doc => {
    doc.createParagraph('___________________________________________________________________');
};

const numbering = new Numbering();

const abstract = numbering.createAbstractNumbering();

const addPageNumbers = (document) => {
    document.Footer.createParagraph()
        .addRun(new TextRun('Page ').pageNumber())
        .addRun(new TextRun(' of ').numberOfTotalPages())
        .style('footerText')
        .right();
};

export { addStyles, renderHorizontalRule, numbering, abstract, addPageNumbers };