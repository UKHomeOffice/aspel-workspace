import React from 'react';
import dictionary from '@asl/dictionary';

const Acronym = ({
  children
}) => dictionary[children]
  ? <abbr title={dictionary[children]}>{children}</abbr>
  : children;

export default Acronym;
