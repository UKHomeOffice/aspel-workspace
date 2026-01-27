import { Paragraph, TextRun, Indent } from 'docx';
import { numbering, abstract } from './docx-style-helper'
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
 
const renderNode = (parent, node, depth = 0, paragraph, numbers, index, options = {}) => {
    const { applyTextFilter, customNodeRenderers } = options;

    const getContent = input => {
        const raw = get(input, 'nodes[0].leaves[0].text', get(input, 'nodes[0].text', ''));
        const text = (typeof raw === 'string' ? raw : '').trim();
        return applyFilter(text, applyTextFilter);
    };

    // Allow caller to override specific node types
    const renderer = customNodeRenderers?.[node.type];
    if (typeof renderer === 'function') {
        const renderNext = (nextParent, nextNode, nextDepth = depth, nextParagraph = paragraph, nextNumbers = numbers, nextIndex = index) =>
            renderNode(nextParent, nextNode, nextDepth, nextParagraph, nextNumbers, nextIndex, options);

        const context = { depth, paragraph, numbers, index, renderNext };
        return renderer(parent, node, context);
    }

    let text;
    let p;
    let addToDoc;

    switch (node.type) {
        case 'list-item': {
            p = new Paragraph();
            p.style('body');
            numbers ? p.setNumbering(numbers, depth) : p.bullet(depth);
            parent.addParagraph(p);
            (node.nodes || []).forEach((n, idx) => renderNode(parent, n, depth + 1, p, null, idx, options));
            break;
        }
        case 'heading-one':
            parent.createParagraph(getContent(node)).heading1();
            break;
        case 'heading-two':
            parent.createParagraph(getContent(node)).heading2();
            break;
        case 'block-quote':
            parent.createParagraph(getContent(node)).style('aside');
            break;
        case 'paragraph':
        case 'block': {
            if (node.nodes && node.nodes.length === 1 && !getContent(node)) {
                return;
            }
            addToDoc = !paragraph;
            paragraph = paragraph || new Paragraph();
            (node.nodes || []).forEach((childNode, childNodeIndex) => {
                const leaves = childNode.leaves || [childNode];
                leaves.forEach(leaf => {
                    text = new TextRun(applyFilter(String(leaf.text || ''), applyTextFilter));
                    (leaf.marks || []).forEach(mark => {
                        switch (mark.type) {
                            case 'bold':
                                text.bold();
                                break;
                            case 'italic':
                                text.italics();
                                break;
                            case 'underlined':
                                text.underline();
                                break;
                            case 'subscript':
                                text.subScript();
                                break;
                            case 'superscript':
                                text.superScript();
                                break;
                        }
                    });
                    if (!addToDoc && (index > 0) && childNodeIndex === 0) {
                        text.break().break();
                    }
                    paragraph.style('body');
                    paragraph.addRun(text);
                });
            });
            if (addToDoc) {
                parent.addParagraph(paragraph);
            }
            break;
        }
        case 'numbered-list': {
            if (abstract && numbering) {
                abstract
                    .createLevel(depth, 'decimal', '%2.', 'start')
                    .addParagraphProperty(new Indent(720 * (depth + 1), 0));
                const concrete = numbering.createConcreteNumbering(abstract);
                (node.nodes || []).forEach(item => renderNode(parent, item, depth, paragraph, concrete, undefined, options));
            } else {
                (node.nodes || []).forEach(item => renderNode(parent, item, depth, paragraph, undefined, undefined, options));
            }
            break;
        }
        case 'bulleted-list':
            (node.nodes || []).forEach(item => renderNode(parent, item, depth, paragraph, undefined, undefined, options));
            break;
        default:
            if (node.text) {
                renderNode(parent, { object: 'block', type: 'paragraph', nodes: [node] }, depth, paragraph, numbers, index, options);
            }
    }
};

const renderTextEditor = (doc, value, { onStringFallback, onError, separator } = {}) => {
    let content = value;
    if (typeof value === 'string') {
        try {
            content = JSON.parse(value);
        } catch (e) {
            if (typeof onStringFallback === 'function') {
                onStringFallback(doc, value);
            }
            return;
        }
    }

    const nodes = get(content, 'document.nodes', []);
    nodes.forEach(node => {
        try {
            renderNode(doc, node);
        } catch (err) {
            if (typeof onError === 'function') {
                onError(doc, err, node);
            } else {
                doc.createParagraph('There was a problem rendering this content').style('aside');
            }
        }
    });

    if (typeof separator === 'function') {
        separator(doc);
    }
};

export { renderMarkdown, renderLabel, renderNull, renderText, renderTextEditor, renderNode };
