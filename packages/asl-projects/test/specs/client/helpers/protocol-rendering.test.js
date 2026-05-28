const assert = require('assert');
const fs = require('fs');
const path = require('path');

const expectSourceToContain = (source, snippets) => {
  snippets.forEach(snippet => assert.ok(source.includes(snippet), snippet));
};

describe('protocol rendering source regressions', () => {
  const sectionSource = fs.readFileSync(
    path.join(__dirname, '../../../../client/pages/sections/protocols/section.js'),
    'utf8'
  );

  const docxRendererSource = fs.readFileSync(
    path.join(__dirname, '../../../../client/components/download-link/renderers/docx-renderer.js'),
    'utf8'
  );

  describe('client/pages/sections/protocols/section.js source', () => {
    it('filters visible fields using protocol-aware context', () => {
      expectSourceToContain(sectionSource, [
        'const fieldContext = {',
        '...project,',
        '...values,',
        'readonly: !editable || values.deleted,',
        'values',
        'const visibleFields = fields.filter(f => f.show === undefined || f.show(fieldContext));',
        'fields={visibleFields}'
      ]);
    });
  });

  describe('client/components/download-link/renderers/docx-renderer.js source', () => {
    it('resolves field type against protocol-aware field context', () => {
      expectSourceToContain(docxRendererSource, [
        'const type = resolveFieldValue(field.type, fieldContext);'
      ]);
    });

    it('checks field visibility against protocol-aware field context', () => {
      expectSourceToContain(docxRendererSource, [
        'if (field.show && !field.show(fieldContext)) {'
      ]);
    });

    it('supports standard protocol field types in docx export', () => {
      expectSourceToContain(docxRendererSource, [
        "case 'standard-radio':",
        "case 'standard-list':",
        'if (isRichTextFieldType(type)) {'
      ]);
    });

    it('routes declaration fields through renderDeclaration', () => {
      expectSourceToContain(docxRendererSource, [
        'const renderDeclaration =',
        'return renderDeclaration('
      ]);
    });
  });
});

