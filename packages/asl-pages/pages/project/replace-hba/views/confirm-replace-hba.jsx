import React from 'react';
import { ErrorSummary, WidthContainer, Header } from '@ukhomeoffice/asl-components';

const ConfirmReplaceHba = () => {
  return (
    <WidthContainer>
      <ErrorSummary />
      <Header
        title="Confirm HBA file"
        subtitle="Project licence amendment"
      />

    </WidthContainer>
  );
};
export default ConfirmReplaceHba;
