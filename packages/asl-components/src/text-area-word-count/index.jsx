import React, { useState } from 'react';
import { TextArea } from '@ukhomeoffice/react-components';
import classNames from 'classnames';
import WordCountHintMessage from './wordcount-hint-message';
import omit from 'lodash/omit';

export default function TextAreaWithWordCount(props) {

    const { value, maxWordCount, error, values, name } = props;

    const [content, setContent] = useState(value || '');

    const formErrorClass = classNames({
        'govuk-form-group': true,
        'govuk-character-count': true,
        'govuk-form-group--error': error
    });

    return (
        <div className={formErrorClass} id={`${name}-form-group`}>
            <TextArea
                {...omit(props, 'maxWordCount')}
                value={content}
                onChange={e => setContent(e.target.value)}
            />
            <WordCountHintMessage content={content} id={values.id} maxWordCount={maxWordCount} />
        </div>
    );
}
