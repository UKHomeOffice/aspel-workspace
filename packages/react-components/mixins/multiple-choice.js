export default (superclass) => class MultipleChoice extends superclass {

    optionId(opt) {
        if(opt.id) {
            return opt.id;
        }
        const key = opt.value.toString().split('').reduce((str, char) => str + char.charCodeAt(0), '');
        return `${this.id()}-${opt.value.toString().toLowerCase().replace(/[^a-z0-9-]/g, '')}-${key}`;
    }

    hasValue(val) {
        return Array.isArray(this.props.value) ? this.props.value.includes(val) : this.props.value === val;
    }

    normaliseOptions() {
        return this.props.options.map(opt => {
            if (typeof opt === 'string') {
                return {
                    label: opt,
                    value: opt
                };
            }
            return opt;
        });
    }

};
