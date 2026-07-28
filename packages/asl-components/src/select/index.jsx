import { Select as BaseSelect } from '@ukhomeoffice/react-components';
import { describedByIds, describeChildOfType } from '../aria-describedby';

// ASL-5082: associate the <select> with its hint AND error via aria-describedby.
// The select sits alongside the label/hint/error nodes, so we target it by type.
class Select extends BaseSelect {
    render() {
        return describeChildOfType(super.render(), 'select', describedByIds(this.id(), this.props));
    }
}

export default Select;
