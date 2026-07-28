import { CheckboxGroup as BaseCheckboxGroup } from '@ukhomeoffice/react-components';
import { describedByIds, describeOnlyChild } from '../aria-describedby';

// ASL-5081/5082: associate the checkbox fieldset with its hint AND error via
// aria-describedby. Same approach as RadioGroup - clone the only child fieldset.
class CheckboxGroup extends BaseCheckboxGroup {
    render() {
        return describeOnlyChild(super.render(), describedByIds(this.id(), this.props));
    }
}

export default CheckboxGroup;
