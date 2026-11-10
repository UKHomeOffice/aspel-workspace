import React from 'react';
import {render, screen} from '@testing-library/react';
import {Snippet} from '@ukhomeoffice/asl-components/src/snippet';
import {describe, expect, test} from '@jest/globals';

const uploadHba = require('../../../../../../pages/task/read/content/upload-hba');

describe('HBA Upload intro', () => {
  const content = {
    intro: `To {{action}} the licence you must upload the PPL assessment form containing the harm benefit analysis (HBA) for this {{type}}.

  The HBA will be visible to ASRU only.`
  };

  test('Amend intro wording', () => {
    render(
      <div>
        <Snippet content={content} action="amend" type="amendment">intro</Snippet>
      </div>
    );

    const paragraphs = screen.getAllByText(/To amend the licence|The HBA will be visible to ASRU only/);
    expect(paragraphs).toHaveLength(2);
    expect(paragraphs[0]).toHaveTextContent(
      'To amend the licence you must upload the PPL assessment form containing the harm benefit analysis (HBA) for this amendment.'
    );
    expect(paragraphs[1]).toHaveTextContent('The HBA will be visible to ASRU only.');
  });

  test('Grant intro wording', () => {
    render(
      <div>
        <Snippet content={content} action="grant" type="application">intro</Snippet>
      </div>
    );

    const paragraphs = screen.getAllByText(/To grant the licence|The HBA will be visible to ASRU only/);
    expect(paragraphs).toHaveLength(2);
    expect(paragraphs[0]).toHaveTextContent(
      'To grant the licence you must upload the PPL assessment form containing the harm benefit analysis (HBA) for this application.'
    );
    expect(paragraphs[1]).toHaveTextContent('The HBA will be visible to ASRU only.');
  });

  test('Mustache framework append Transfer into content', () => {
    render(
      <div>
        <Snippet content={content} action="transfer" type="transfer">intro</Snippet>
      </div>
    );

    const paragraphs = screen.getAllByText(/To transfer the licence|The HBA will be visible to ASRU only/);
    expect(paragraphs).toHaveLength(2);
    expect(paragraphs[0]).toHaveTextContent(
      'To transfer the licence you must upload the PPL assessment form containing the harm benefit analysis (HBA) for this transfer.'
    );
    expect(paragraphs[1]).toHaveTextContent('The HBA will be visible to ASRU only.');
  });

  test('renders the upload hint content', () => {
    render(
      <Snippet content={uploadHba} actionContent="amending the licence">
        fields.upload.hint
      </Snippet>
    );

    expect(
      screen.getByText('The file must be a doc, docx or pdf. The maximum size is 15MB.')
    ).toBeInTheDocument();
  });

  test('renders intro with natural wording in both positions', () => {
    render(
      <Snippet
        content={uploadHba}
        actionToContent="amend the licence"
        actionContent="amending the licence"
        type="amendment"
      >
        intro.template
      </Snippet>
    );

    expect(screen.getByText(/To amend the licence you must upload/)).toBeInTheDocument();
    expect(screen.getByText(/before amending the licence/)).toBeInTheDocument();
  });
});
