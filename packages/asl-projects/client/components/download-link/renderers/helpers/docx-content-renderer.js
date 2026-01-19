import { Paragraph, TextRun, Indent } from 'docx';
import unified from 'unified';
import remarkParse from 'remark-parse';
import get from 'lodash/get';

const applyFilter = (text, filter) => {
    if (typeof text !== 'string') {
        return String(text || '');
    }
    return filter ? filter(text) : text;
};

const renderMarkdown = (doc, markdown, style = 'body', { applyTextFilter } = {}) => {
    const tree = unified().use(remarkParse).parse(markdown || '');

    (tree.children || []).forEach(node => {
        switch (node.type) {
            case 'heading': {
                const text = node.children.find(c => c.type === 'text')?.value || '';
                doc.createParagraph(applyFilter(text, applyTextFilter)).style(`Heading${node.depth}`);
                break;
            }
            case 'paragraph': {
                const text = node.children.find(c => c.type === 'text')?.value || '';
                doc.createParagraph(applyFilter(text, applyTextFilter)).style(style);
                break;
            }
            case 'list': {
                (node.children || []).forEach(listItem => {
                    const text = get(listItem, 'children[0].children[0].value', '').trim();
                    const p = new Paragraph(applyFilter(text, applyTextFilter));
                    p.style(style);
                    p.bullet(0);
                    doc.addParagraph(p);
                });
                break;
            }
        }
    });
};

const renderLabel = (doc, text) => {
    if (!text) { return; }
    doc.createParagraph(text).style('Question');
};

const renderNull = (doc, { separator } = {}) => {
    const p = new Paragraph();
    p.style('body');
    p.addRun(new TextRun('No answer provided').italics());
    doc.addParagraph(p);
    if (separator) { separator(doc); }
};

const renderText = (doc, value, { applyTextFilter, separator } = {}) => {
    if (typeof value === 'boolean') {
        doc.createParagraph(value ? 'Yes' : 'No').style('body');
    } else if (value == null || value === '') {
        return renderNull(doc, { separator });
    } else {
        const text = applyFilter(String(value), applyTextFilter);
        doc.createParagraph(text).style('body');
    }
    if (separator) { separator(doc); }
};

export { renderMarkdown, renderLabel, renderNull, renderText };
