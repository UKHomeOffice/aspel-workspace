// Rebuilds the id react-components' MultipleChoice mixin gives the FIRST option

function optionId(name, option) {
    // An option can pin its own id, in which case the mixin uses it verbatim.
    if (option && typeof option === 'object' && option.id) {
        return option.id;
    }
    const value = (option && typeof option === 'object') ? option.value : option;
    const v = String(value);
    const key = v.split('').reduce((str, char) => str + char.charCodeAt(0), '');
    return `${name}-${v.toLowerCase().replace(/[^a-z0-9-]/g, '')}-${key}`;
}

// The first option's id for a radio/checkbox field, or `#${name}` fallback when
// the field somehow has no options.
function firstOptionHref(name, field = {}) {
    const first = (field.options || [])[0];
    if (first === undefined) {
        return `#${name}`;
    }
    return `#${optionId(name, first)}`;
}

module.exports = { firstOptionHref, optionId };
