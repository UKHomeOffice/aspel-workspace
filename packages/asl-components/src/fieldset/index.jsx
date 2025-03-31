import React, { useState, useEffect, useMemo } from 'react';
import map from 'lodash/map';
import omit from 'lodash/omit';
import without from 'lodash/without';
import castArray from 'lodash/castArray';
import isUndefined from 'lodash/isUndefined';
import classnames from 'classnames';
import {
    TextArea,
    Input,
    CheckboxGroup,
    RadioGroup,
    Select,
    DateInput,
    Warning
} from '@ukhomeoffice/react-components';
import {
    Snippet,
    ConditionalReveal,
    DetailsReveal,
    SpeciesSelector,
    AutoComplete,
    ApplicationConfirm,
    RestrictionsField,
    Markdown,
    MultiInput,
    DurationField,
    SelectMany,
    Inset,
    TextAreaWithWordCount
} from '../';

function getLabel(opt, name, type = 'label') {
    if (type === 'hint') {
        return <Snippet optional>{`fields.${name}.options.${opt}.hint`}</Snippet>;
    }
    try {
        return <Snippet fallback={`fields.${name}.options.${opt}`}>{`fields.${name}.options.${opt}.label`}</Snippet>;
    } catch (e) {
        return opt;
    }
}

function SingleRadio(props) {
    const settings = props.options[0];
    const value = isUndefined(settings.value) ? settings : settings.value;
    const hint = settings.hint || getLabel(value, props.fieldName, 'hint');

    return (
        <div className="govuk-form-group">
            <input type="hidden" name={props.name} value={value} />
            { props.label && <h3>{ props.label }</h3> }
            {
                settings.label || getLabel(value, props.fieldName)
            }
            {
                hint && <span className="govuk-hint">{ hint }</span>
            }
            {
                settings.reveal
            }
        </div>
    );
}

const fields = {
    inputText: props => <Input { ...props } />,
    inputEmail: props => <Input type="email" { ...props } />,
    inputFile: props => <Input type="file" { ...props } />,
    inputPassword: props => <Input type="password" { ...props } />,
    declaration: props => <ApplicationConfirm { ...props } />,
    inputDate: props => <DateInput { ...props } onChange={value => props.onChange({ target: { value } })} />,
    textarea: props => <TextArea { ...omit(props, ['meta']) } autoExpand={true} />,
    textAreaWithWordCount: props => <TextAreaWithWordCount { ...omit(props, ['meta']) } />,
    radioGroup: props => {
        if (!props.options) {
            throw new Error(`radioGroup '${props.name}' has undefined options`);
        }
        return props.options.length > 1
            ? <RadioGroup initialHideReveals={true} { ...props } />
            : <SingleRadio { ...props } />;
    },
    checkboxGroup: props => <CheckboxGroup initialHideReveals={true} { ...props } />,
    select: props => <Select { ...props } />,
    selectMany: props => <SelectMany { ...props } />,
    conditionalReveal: props => <ConditionalReveal { ...props } />,
    detailsReveal: props => <DetailsReveal { ...props } />,
    speciesSelector: props => <SpeciesSelector fieldName={props.name} {...props} />,
    restrictionsField: props => <RestrictionsField {...props} />,
    inputDuration: props => <DurationField {...props} />,
    autoComplete: props => <AutoComplete {...props} />,
    multiInput: props => <MultiInput {...props} />,
    warning: props => <Warning><Snippet {...props}>{ props.contentKey }</Snippet></Warning>,
    text: props => (
        <div className={classnames('govuk-form-group', props.name)}>
            <h3>{ props.label }</h3>
            <Markdown>{ props.format ? props.format(props.value) : props.value }</Markdown>
        </div>
    ),
    fieldset: props => (
        <div className={classnames('govuk-form-group', props.name)}>
            {props.label && <label className="govuk-label">{props.label}</label>}
            <Fieldset schema={props.fields} model={props.values} errors={props.errors} formatters={props.formatters} />
        </div>
    )
};

function automapReveals(options, props) {
    if (!options) {
        return;
    }
    return options.map(opt => {
        if (opt.reveal) {
            return {
                ...opt,
                reveal: (
                    <Inset>
                        <Fieldset schema={opt.reveal} model={props.values} errors={props.errors} formatters={props.formatters} />
                    </Inset>
                )
            };
        }
        return opt;
    });
}

function Field({
    name,
    prefix,
    error,
    inputType,
    value,
    label,
    hint,
    formatHint,
    onChange,
    showIf,
    options,
    preventOptionMapping = false,
    ...props
}) {
    if (inputType === 'checkboxGroup') {
        value = castArray(value).filter(value => value !== null);
    }

    function normaliseOptions(options) {
        if (!options) {
            return;
        }

        return options.map(opt => {
            if (typeof opt === 'object') {
                if (!opt.label) {
                    opt = {
                        ...opt,
                        label: getLabel(opt.value, name)
                    };
                }
                if (!opt.hint) {
                    opt = {
                        ...opt,
                        hint: getLabel(opt.value, name, 'hint')
                    };
                }
                if (opt.hint && typeof opt.hint === 'string') {
                    opt.hint = <Markdown unwrapSingleLine={true}>{opt.hint}</Markdown>;
                }
                return opt;
            }
            return {
                value: opt,
                label: getLabel(opt, name),
                hint: getLabel(opt, name, 'hint')
            };
        });
    }

    const normalisedOptions = useMemo(() => {
        let normalizedOptions = options ?? [];

        if (!preventOptionMapping) {
            normalizedOptions = normaliseOptions(normalizedOptions);
        }

        if (props.automapReveals) {
            normalizedOptions = automapReveals(normalizedOptions, props);
        }

        return normalizedOptions;
    }, [options, props, preventOptionMapping]);

    const [fieldValue, setFieldValue] = useState(value);

    useEffect(() => {
        if (onChange) {
            onChange({
                ...props.values,
                [name]: fieldValue
            });
        }
    }, [fieldValue]);

    if (formatHint) {
        hint = formatHint({ name, prefix, hint });
    }

    function onFieldChange(e) {
        let newValue = e.target ? e.target.value : e;
        if (newValue === 'true') {
            newValue = true;
        }
        if (newValue === 'false') {
            newValue = false;
        }
        if (Array.isArray(fieldValue)) {
            const option = normalisedOptions.find(opt => opt.value === newValue);
            const exclusiveOptions =
              normalisedOptions
                  .filter(opt => opt.behaviour === 'exclusive')
                  .map(opt => opt.value);

            if (option?.behaviour === 'exclusive' && !fieldValue.includes(newValue)) {
                // exclusive option selected, deselect everything else
                newValue = [newValue];
            } else if (fieldValue.includes(newValue)) {
                newValue = without(fieldValue, newValue);
            } else {
                // Selecting non-exclusive option: remove exclusive option if already selected
                newValue = [
                    ...(fieldValue.filter(prevValue => !exclusiveOptions.includes(prevValue) && fieldValue !== null)),
                    newValue
                ];
            }
        }
        setFieldValue(newValue);
    }

    const Component = fields[inputType];

    if (showIf && !showIf(props.values)) {
        return null;
    }

    if (hint && typeof hint === 'string') {
        hint = <Markdown unwrapSingleLine={true}>{ hint }</Markdown>;
    }

    const snippetProps = props.formatters?.[name]?.renderContext ?? {};

    return <Component
        label={isUndefined(label) ? <Snippet {...snippetProps}>{`fields.${name}.label`}</Snippet> : label}
        hint={isUndefined(hint) ? <Snippet optional {...snippetProps}>{`fields.${name}.hint`}</Snippet> : hint}
        error={error && <Snippet fallback={`errors.default.${error}`} {...snippetProps}>{`errors.${name}.${error}`}</Snippet>}
        value={fieldValue}
        onChange={onFieldChange}
        name={prefix ? `${prefix}-${name}` : name}
        options={normalisedOptions}
        {...props}
    />;
}

export default function Fieldset({ schema, errors = {}, formatters = {}, model, ...props }) {
    return (
        <fieldset>
            {
                map(schema, (field, key) => {
                    const fieldName = field.prefix ? `${field.prefix}-${key}` : key;
                    return (
                        <Field
                            {...props}
                            {...field}
                            key={key}
                            values={model}
                            value={model[fieldName]}
                            error={errors[fieldName]}
                            errors={errors}
                            formatters={formatters}
                            name={key}
                            model={props.values}
                            format={(formatters[key] || {}).format}
                            formatHint={(formatters[key] || {}).formatHint}
                        />
                    );
                })
            }
        </fieldset>
    );
}
