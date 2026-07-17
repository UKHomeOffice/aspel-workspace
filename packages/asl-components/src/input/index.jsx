import { Input as BaseInput } from '@ukhomeoffice/react-components';
import { describedByIds, describeOnlyChild } from '../aria-describedby';

// ASL-5082: associate a text/number/email/password/file input with its hint AND
// error via aria-describedby. The upstream Input renders the <input> as the only
// child of its InputWrapper, so we clone that child.
class Input extends BaseInput {
    render() {
        return describeOnlyChild(super.render(), describedByIds(this.id(), this.props));
    }
}

export default Input;
