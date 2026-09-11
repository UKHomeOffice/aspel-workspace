import { RadioGroup as BaseRadioGroup } from '@ukhomeoffice/react-components';
import { describedByIds, describeOnlyChild } from '../aria-describedby';
import suppressEmptyLegend from '../empty-legend';

// ASL-5081/5082: associate the radio fieldset with its hint AND error via
// aria-describedby. The upstream fieldset is the only child of the form group,
// so we just clone it - all radio behaviour is inherited untouched.
class RadioGroup extends BaseRadioGroup {
    render() {
        return suppressEmptyLegend(
            describeOnlyChild(super.render(), describedByIds(this.id(), this.props)),
            this.props.label
        );
    }
}

export default RadioGroup;
