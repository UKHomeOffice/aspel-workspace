import React from 'react';
import { render, screen } from '@testing-library/react';
import { Snippet } from '@ukhomeoffice/asl-components/src/snippet';
import { describe, expect, test } from '@jest/globals';

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
});
