import React from 'react';
import dictionary from '@ukhomeoffice/asl-dictionary';

const Acronym = ({
    children,
    usePlural = false
}) => {
    const definition = usePlural && dictionary.plural[children]
        ? dictionary.plural[children]
        : dictionary[children];

    return definition
        ? <abbr title={definition}>{children}</abbr>
        : <span>{children}</span>;
};

export default Acronym;
