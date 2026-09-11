import { CheckboxGroup as BaseCheckboxGroup } from '@ukhomeoffice/react-components';
import { describedByIds, describeOnlyChild } from '../aria-describedby';
import suppressEmptyLegend from '../empty-legend';

// ASL-5081/5082: associate the checkbox fieldset with its hint AND error via
// aria-describedby. Same approach as RadioGroup - clone the only child fieldset.
class CheckboxGroup extends BaseCheckboxGroup {
    render() {
        return suppressEmptyLegend(
            describeOnlyChild(super.render(), describedByIds(this.id(), this.props)),
            this.props.label
        );
    }
}

export default CheckboxGroup;
